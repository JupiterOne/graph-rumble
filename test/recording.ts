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

function redact(entry): void {
  mutations.unzipGzippedRecordingEntry(entry);
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
  const response = JSON.parse(entry.response.content.text);

  if (response.forEach) {
    response.forEach((responseValue, responseIndex) => {
      keysToRedactMap.forEach((redactionValue, keyToRedact) => {
        if (responseValue[keyToRedact]) {
          response[responseIndex][keyToRedact] = redactionValue;
        }
      });
      if ('services' in responseValue) {
        redactFromServices(responseValue.services);
      }
    });
    entry.response.content.text = JSON.stringify(response);
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
