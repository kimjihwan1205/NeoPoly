export const IMAGE_GENERATION_LOADING_MS = 1600;

type ImageGenerationLoadingOptions = {
  setLoading: (loading: boolean) => void;
  onComplete: () => void;
  schedule?: (callback: () => void, delay: number) => unknown;
};

export const startImageGenerationLoading = ({
  setLoading,
  onComplete,
  schedule = (callback, delay) => window.setTimeout(callback, delay),
}: ImageGenerationLoadingOptions) => {
  setLoading(true);
  return schedule(() => {
    onComplete();
    setLoading(false);
  }, IMAGE_GENERATION_LOADING_MS);
};
