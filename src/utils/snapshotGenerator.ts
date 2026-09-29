export function generateSnapshotImage(
  plate: string,
  speed: number,
  limit: number,
  color: string,
  cameraModel: string
): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 270;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Asphalt road background
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 480, 270);

  // Road texture / noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let i = 0; i < 480; i += 40) {
    ctx.fillRect(i, 0, 1, 270);
  }

  // Lane dash marking
  ctx.strokeStyle = '#374151';
  ctx.setLineDash([12, 12]);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 135);
  ctx.lineTo(480, 135);
  ctx.stroke();

  // Draw Vehicle Body
  ctx.fillStyle = color;
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(155, 85, 170, 85, 8);
  } else {
    ctx.rect(155, 85, 170, 85);
  }
  ctx.fill();

  // Car Roof & Windshield
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(195, 95, 80, 65);

  // Headlights
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(315, 92, 10, 16);
  ctx.fillRect(315, 142, 10, 16);

  // Bounding Box (ANPR OCR Trap Box)
  ctx.strokeStyle = speed > limit ? '#ef4444' : '#10b981';
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.strokeRect(145, 75, 190, 105);

  // Corner Targeting Crosshairs
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  // Top Left
  ctx.beginPath();
  ctx.moveTo(140, 90);
  ctx.lineTo(140, 70);
  ctx.lineTo(160, 70);
  ctx.stroke();
  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(340, 165);
  ctx.lineTo(340, 185);
  ctx.lineTo(320, 185);
  ctx.stroke();

  // Top CCTV Status Header Overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
  ctx.fillRect(0, 0, 480, 36);

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  const nowStr = new Date().toLocaleString('ko-KR', { hour12: false });
  ctx.fillText(`CAM: ${cameraModel} | ${nowStr}`, 12, 23);

  // REC Red Dot
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(460, 18, 5, 0, Math.PI * 2);
  ctx.fill();

  // Bottom Speed & License OSD Tag Box
  const isOver = speed > limit;
  ctx.fillStyle = isOver ? 'rgba(220, 38, 38, 0.9)' : 'rgba(16, 185, 129, 0.9)';
  ctx.fillRect(10, 205, 260, 52);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px "JetBrains Mono", monospace';
  ctx.fillText(`SPEED: ${speed} km/h (LIMIT: ${limit})`, 18, 226);
  ctx.font = 'bold 13px "Noto Sans KR", sans-serif';
  ctx.fillText(`PLATE: ${plate} [${isOver ? '단속 위반' : '정상 통과'}]`, 18, 246);

  return canvas.toDataURL('image/jpeg', 0.88);
}

export function generateRandomKoreanPlate(): string {
  const regions = ['서울', '경기', '부산', '대구', '인천', '강원', '전남', '경북', '대전', '울산'];
  const region = regions[Math.floor(Math.random() * regions.length)];
  const num1 = Math.floor(Math.random() * 90 + 10);
  const hanguls = ['가', '나', '다', '라', '마', '거', '너', '더', '러', '머', '버', '서', '어', '저'];
  const hangul = hanguls[Math.floor(Math.random() * hanguls.length)];
  const num2 = Math.floor(Math.random() * 9000 + 1000);
  return `${num1}${hangul} ${num2} (${region})`;
}
