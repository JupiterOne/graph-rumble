import {
  Entity,
  IntegrationInstanceConfig,
  IntegrationInvocationConfig,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  mutations,
  StepTestConfig,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export const rumbleRecordingOptions: Partial<SetupRecordingInput> = {
  mutateEntry: (entry) => redact(entry),
};

export function setupRumbleRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    mutateEntry: (entry) => {
      redact(entry);
    },
  });
}

function applyPreredactionMutations(entry) {
  mutations.unzipGzippedRecordingEntry(entry);
}

function redactFromJSONL(entry): void {
  const jsonItems = entry.response.content.text.split('\n');
  let redactedResponse = '';
  for (const jsonItem of jsonItems) {
    const jsonObject = JSON.parse(jsonItem);
    for (const [responseKey, responseValue] of jsonObject.entries()) {
      for (const [redactionKey, redactionValue] of redactionMap.entries()) {
        if (responseValue[redactionKey]) {
          jsonObject[responseKey][redactionKey] = redactionValue;
        }
      }
    }
    redactedResponse += JSON.stringify(jsonObject) + '\n';
  }
  entry.response.content.text = redactedResponse;
}

function getRedactionMap(): Map<string, any> {
  const DEFAULT_REDACT = '[REDACTED]';
  const keysToRedactMap = new Map();
  keysToRedactMap.set('export_token', DEFAULT_REDACT);
  keysToRedactMap.set('download_token', DEFAULT_REDACT);
  keysToRedactMap.set('export_token_last_used_by', DEFAULT_REDACT);
  keysToRedactMap.set('first_name', DEFAULT_REDACT);
  keysToRedactMap.set('last_name', DEFAULT_REDACT);
  // email needs to fit the email format
  keysToRedactMap.set('email', 'first.last@example.com');
  keysToRedactMap.set('last_login_ip', DEFAULT_REDACT);
  keysToRedactMap.set('last_task_by', 'first.last@example.com');
  return keysToRedactMap;
}

const redactionMap = getRedactionMap();

function redact(entry): void {
  applyPreredactionMutations(entry);

  try {
    const response = JSON.parse(entry.response.content.text);

    if (Array.isArray(response)) {
      for (const [responseIndex, responseValue] of response.entries()) {
        for (const [redactionKey, redactionValue] of redactionMap.entries()) {
          if (responseValue[redactionKey]) {
            response[responseIndex][redactionKey] = redactionValue;
          }
        }

        if ('services' in responseValue) {
          redactFromServices(responseValue.services);
        }
      }
      entry.response.content.text = JSON.stringify(response);
    }
  } catch (err) {
    // try to redact as JSONL
    redactFromJSONL(entry);
  }
}

function redactFromServices(services) {
  for (const record in services) {
    if ('http.body' in services[record]) {
      services[record]['http.body'] = '<html><body>[[REDACTED]]</body></html>';
    }
  }
}

export type WithRecordingParams = SetupRecordingInput;

export async function withRecording(
  withRecordingParams: WithRecordingParams,
  cb: () => Promise<void>,
) {
  const recording = setupRecording(withRecordingParams);

  try {
    await cb();
  } finally {
    await recording.stop();
  }
}

type AfterStepCollectionExecutionParams = {
  stepConfig: StepTestConfig<
    IntegrationInvocationConfig<IntegrationInstanceConfig>,
    IntegrationInstanceConfig
  >;
  stepResult: {
    collectedEntities: Entity[];
    collectedRelationships: Relationship[];
    collectedData: {
      [key: string]: any;
    };
    encounteredTypes: string[];
  };
};

type CreateStepCollectionTestParams = {
  recordingSetup: WithRecordingParams;
  stepConfig: StepTestConfig;
  afterExecute?: (params: AfterStepCollectionExecutionParams) => Promise<void>;
};

export function createStepCollectionTest({
  recordingSetup,
  stepConfig,
  afterExecute,
}: CreateStepCollectionTestParams) {
  return async () => {
    await withRecording(recordingSetup, async () => {
      const stepResult = await executeStepWithDependencies(stepConfig);

      expect(stepResult).toMatchStepMetadata(stepConfig);

      if (afterExecute) await afterExecute({ stepResult, stepConfig });
    });
  };
}
