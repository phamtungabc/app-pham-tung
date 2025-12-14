import { FaceShape, HairStyleOption, FaceShapeAdvice } from './types';

export const HAIR_STYLES: HairStyleOption[] = [
  { id: 'undercut', name: 'Undercut', description: 'Cạo sát hai bên, đỉnh dài' },
  { id: 'mohican', name: 'Mohican', description: 'Cạo trắng hai bên, mái vuốt dọc' },
  { id: 'buzz_cut', name: 'Buzz Cut', description: 'Đầu cua/Húi cua 1-3cm' },
  { id: 'sport', name: 'Sport', description: 'Gọn gàng, mái dựng khỏe khoắn' },
  { id: 'side_part_73', name: 'Side Part 7/3', description: 'Chia ngôi lệch lịch lãm' },
  { id: 'side_part_64', name: 'Side Part 6/4', description: 'Chia ngôi gần giữa, lãng tử' },
  { id: 'quiff', name: 'Quiff', description: 'Mái vuốt ngược, phồng nhẹ tự nhiên' },
  { id: 'pompadour', name: 'Pompadour', description: 'Mái vuốt phồng cao, bóng bẩy cổ điển' },
  { id: 'layer', name: 'Layer', description: 'Tỉa tầng lớp, thư sinh' },
  { id: 'two_block', name: 'Two Block', description: 'Hai khối tóc tách biệt, phong cách Hàn Quốc' },
  { id: 'comma_hair', name: 'Comma Hair', description: 'Tóc mái dấu phẩy' },
  { id: 'mullet', name: 'Mullet', description: 'Tóc cá đối, gáy dài cá tính' },
  { id: 'man_bun', name: 'Man Bun', description: 'Tóc dài búi củ tỏi' },
  { id: 'top_knot', name: 'Top Knot', description: 'Undercut kết hợp búi tóc đỉnh đầu' },
  { id: 'crew_cut', name: 'Crew Cut', description: 'Tóc ngắn gọn gàng, dài hơn Buzz Cut một chút' },
  { id: 'textured_crop', name: 'Textured Crop', description: 'Tóc ngắn, mái tỉa lộn xộn có chủ đích' },
  { id: 'slicked_back', name: 'Slicked Back', description: 'Chải ngược toàn bộ ra sau' },
];

export const HAIR_COLORS = [
  'Đen tự nhiên',
  'Bạch kim',
  'Xám khói',
  'Nâu hạt dẻ',
  'Nâu socola',
  'Vàng tây',
  'Xanh rêu',
  'Đỏ rượu'
];

export const FACE_SHAPE_ADVICE: Record<FaceShape, FaceShapeAdvice> = {
  [FaceShape.ROUND]: {
    recommended: 'Undercut, Quiff, dựng mái (tạo độ cao)',
    avoid: 'Buzz cut, mái bằng dài (làm mặt ngắn đi)'
  },
  [FaceShape.LONG]: {
    recommended: 'Layer, Side Part, Two Block (che trán)',
    avoid: 'Undercut vuốt quá cao, cạo quá sát hai bên'
  },
  [FaceShape.SQUARE]: {
    recommended: 'Undercut, Pompadour, Buzz Cut',
    avoid: 'Kiểu tóc chia ngôi giữa (bổ luống)'
  },
  [FaceShape.OVAL]: {
    recommended: 'Hầu hết mọi kiểu tóc',
    avoid: 'Che quá nhiều khuôn mặt'
  }
};
