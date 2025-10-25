import { useGLTF } from '@react-three/drei';

// Компонент для загрузки и отображения 3D-модели
export default function GlacierModel() {
  const { scene } = useGLTF('https://bimstandard2.netlify.app/model.glb');

  // @ts-ignore
  return <primitive object={scene} scale={1.5} />;
}
