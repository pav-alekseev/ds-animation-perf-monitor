export const countFps = async (duration: number): Promise<number> => {
  return new Promise((resolve) => {
    let frameCount = 0;
    const start = performance.now();
    function count() {
      frameCount++;
      if (performance.now() - start < duration) {
        requestAnimationFrame(count);
      } else {
        resolve(Math.round((frameCount * 1000) / (performance.now() - start)));
      }
    }
    requestAnimationFrame(count);
  });
};
