import { useLoadingBar, useMessage } from 'naive-ui';
import { shallowRef } from 'vue';
import type { HandleRequestOptions } from './types';

let controller = new AbortController();
let signal = controller.signal;

const loading = shallowRef<boolean>(false);

export function useApiRequest() {
  const loadingBar = useLoadingBar();
  const message = useMessage();

  async function handleRequest<T>(params: HandleRequestOptions<T>): Promise<void> {
    if (loading.value) {
      params.onTryRequestWithLoadingInProgress?.();
      return;
    }

    loading.value = true;

    loadingBar.start();
    try {
      params.beforeRequestStart?.();

      const data = await params.request(signal);

      params.afterRequestFinished?.(data);

      loadingBar.finish();
    } catch (e) {
      params.onRequestError?.();

      handleError(e);
    } finally {
      loading.value = false;
    }
  }

  function abortRequest(): void {
    controller.abort();
  }

  function resetAbortController() {
    controller = new AbortController();
    signal = controller.signal;
  }

  function handleError(e: unknown): void {
    if (signal.aborted) {
      message.warning('Запрос прерван');

      loadingBar.finish();
      resetAbortController();
      return;
    }

    message.error('Внутренняя ошибка сервера, попробуйте позже');
    console.error(e);

    loadingBar.error();
  };

  return {
    loading,
    handleRequest,
    abortRequest,
  };
}
