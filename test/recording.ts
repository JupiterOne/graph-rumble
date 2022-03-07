import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  mutations,
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
