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

type WithRecordingParams = {
  recordingName: string;
  directoryName: string;
  recordingSetupOptions?: SetupRecordingInput['options'];
};

export async function withRecording(
  { recordingName, directoryName, recordingSetupOptions }: WithRecordingParams,
  cb: () => Promise<void>,
) {
  const recording = setupRumbleRecording({
    directory: directoryName,
    name: recordingName,
    options: {
      ...(recordingSetupOptions || {}),
    },
  });

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

type CreateStepCollectionTestParams = WithRecordingParams & {
  stepId: string;
  stepConfig: StepTestConfig;
  afterExecute?: (params: AfterStepCollectionExecutionParams) => Promise<void>;
};

function isMappedRelationship(r: Relationship): boolean {
  return !!r._mapping;
}

function filterDirectRelationships(
  relationships: Relationship[],
): Relationship[] {
  return relationships.filter((r) => !isMappedRelationship(r));
}

export function createStepCollectionTest({
  recordingName,
  directoryName,
  recordingSetupOptions,
  stepConfig,
  afterExecute,
}: CreateStepCollectionTestParams) {
  return async () => {
    await withRecording(
      {
        directoryName,
        recordingName,
        recordingSetupOptions,
      },
      async () => {
        const stepResult = await executeStepWithDependencies(stepConfig);

        expect({
          ...stepResult,
          // HACK (austinkelleher): `@jupiterone/integration-sdk-testing`
          // does not currently support `toMatchStepMetadata` with mapped
          // relationships, which is causing tests to fail. We will add
          // support soon and remove this hack.
          collectedRelationships: filterDirectRelationships(
            stepResult.collectedRelationships,
          ),
        }).toMatchStepMetadata({
          ...stepConfig,
          invocationConfig: {
            ...stepConfig.invocationConfig,
            integrationSteps: stepConfig.invocationConfig.integrationSteps.map(
              (s) => {
                return {
                  ...s,
                  mappedRelationships: [],
                };
              },
            ),
          },
        });

        if (afterExecute) await afterExecute({ stepResult, stepConfig });
      },
    );
  };
}
