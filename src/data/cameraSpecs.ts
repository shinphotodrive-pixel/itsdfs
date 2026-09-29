import { CameraSpec } from '../types';

export const CAMERA_SPECS: CameraSpec[] = [
  {
    id: 'TNO-7180RLP',
    name: '한화비전 TNO-7180RLP',
    brand: 'Hanwha Vision',
    type: '고속 LPR / 3MP',
    sensor: 'Global Shutter',
    isGlobalShutter: true,
    triggerLatency: '30 ~ 100 ms',
    storage: '스냅샷 OSD + Pre/Post 영상클립',
    estPrice: '약 400만 ~ 550만원',
    features: [
      '최대 200km/h 고속 주행 차량 번호판 실시간 인식',
      'Road AI 온보드 탑재 (차종, 색상, 제조사 자동 분류)',
      '독립 단독 무인 단속 임베디드 플랫폼'
    ]
  },
  {
    id: 'XNB-6002',
    name: '한화비전 XNB-6002',
    brand: 'Hanwha Vision',
    type: '분리형 박스 / 2MP',
    sensor: 'Rolling Shutter',
    isGlobalShutter: false,
    triggerLatency: '50 ~ 300 ms',
    storage: 'Micro SD 내장 (1TB) / FTP 스냅샷 전송',
    estPrice: '약 29만 ~ 35만원 (렌즈/하우징 별도)',
    features: [
      '본체-렌즈 분리형 (최대 8m 연장 케이블 지원)',
      'DFS 전시기 함체 내부 협소 공간 매립 최적화',
      'Alarm IN 접점 트리거 지원'
    ]
  },
  {
    id: 'MV-CS020-10GM',
    name: 'Hikrobot MV-CS020-10GM',
    brand: 'Hikrobot',
    type: '머신비전 / 2MP',
    sensor: 'Global Shutter',
    isGlobalShutter: true,
    triggerLatency: '< 1 ms (하드웨어)',
    storage: '호스트 PC/Edge Raw 비압축 전송',
    estPrice: '약 40만 ~ 50만원',
    features: [
      '1ms 미만 초고속 하드웨어 핀 트리거 구동',
      'Hirose 6핀 GPIO 직결 옵토커플러 인터페이스',
      '단독 구동 불가 (외부 제어용 PC/산업용 PC 필요)'
    ]
  },
  {
    id: 'AR0234',
    name: 'AR0234 USB 3.0 모듈',
    brand: 'OnSemi / Generic',
    type: '임베디드 모듈 / 2.3MP',
    sensor: 'Global Shutter',
    isGlobalShutter: true,
    triggerLatency: '1 ~ 5 ms (HW Pin)',
    storage: '라즈베리파이/젯슨 로컬 메모리 저장',
    estPrice: '약 4만 ~ 30만원',
    features: [
      '가성비 극대화 커스텀 임베디드 모듈형',
      'UVC 표준 플러그 앤 플레이 연동 지원',
      '함체 내 방열 및 방수 하우징 설계 필요'
    ]
  },
  {
    id: 'ITC237-PW6M',
    name: 'Dahua DHI-ITC237-PW6M',
    brand: 'Dahua',
    type: 'ITS ANPR / 2MP',
    sensor: 'Global Shutter',
    isGlobalShutter: true,
    triggerLatency: '30 ~ 100 ms',
    storage: 'SD 카드 / NVR 스냅샷 + 비디오',
    estPrice: '약 90만 ~ 210만원',
    features: [
      '온보드 딥러닝 고속 ANPR 엔진 탑재',
      '차단기 릴레이 직접 스위칭 제어 지원',
      '스탠드얼론 올인원 무인 교통 단속 운용'
    ]
  }
];
