import { useRef, useEffect } from 'react';

function TileWaveEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let frame = 0;
    let running = true;

    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawWave(progress) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const lineWidth = Math.max(canvas.width, canvas.height) * 2.0;
      const travelRange = 1.8;
      const startOffset = -0.4;

      const currentOffset = startOffset + progress * travelRange;

      const x0 = canvas.width * currentOffset;
      const y0 = canvas.height * currentOffset;
      const x1 = x0 + lineWidth * Math.SQRT1_2;
      const y1 = y0 + lineWidth * Math.SQRT1_2;
      const x2 = x1 + (canvas.width - lineWidth) * Math.SQRT1_2;
      const y2 = y1 + (canvas.height - lineWidth) * Math.SQRT1_2;

      const grad = ctx.createLinearGradient(x0, y0, x2, y2);

      grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.0)');
      grad.addColorStop(0.15, 'rgba(255, 255, 255, 0.02)');
      grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.08)');
      grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.20)');
      grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.08)');
      grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.02)');
      grad.addColorStop(0.95, 'rgba(255, 255, 255, 0.005)');
      grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

      let globalAlpha = 1;
      const fadeOutStartProgress = 0.8;
      const fadeOutEndProgress = 0.99;

      if (progress >= fadeOutStartProgress) {
        globalAlpha = 1 - (progress - fadeOutStartProgress) / (fadeOutEndProgress - fadeOutStartProgress);
        if (globalAlpha < 0) globalAlpha = 0;
      }

      ctx.save();
      ctx.globalAlpha = globalAlpha;
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    function animate() {
      if (!running) return;
      frame++;
      const totalDurationFrames = 3.0 * 60;
      let progress = (frame % totalDurationFrames) / totalDurationFrames;

      if (progress >= 0.99) {
        frame = 0;
        progress = 0;
      }

      drawWave(progress);
      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      running = false;
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        zIndex: 2,
        mixBlendMode: 'screen',
      }}
    />
  );
}

export default TileWaveEffect;
