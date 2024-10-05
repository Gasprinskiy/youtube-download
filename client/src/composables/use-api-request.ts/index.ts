import { useLoadingBar, useNotification, useMessage } from 'naive-ui';
import { shallowRef } from 'vue';
import type { HandleRequestOptions } from './types';

const controller = new AbortController();
const signal = controller.signal;

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

  function handleError(e: unknown): void {
    if (signal.aborted) {
      message.warning('Запрос прерван');

      loadingBar.finish();
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
