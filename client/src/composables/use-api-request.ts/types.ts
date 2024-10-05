export interface HandleRequestOptions<T> {
  request: (signal?: AbortSignal) => Promise<T>;
  beforeRequestStart?: () => void;
  afterRequestFinished?: (data: T) => void;
  onRequestError?: () => void;
  onTryRequestWithLoadingInProgress?: () => void;
}
