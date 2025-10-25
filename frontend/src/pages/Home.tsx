import MainTitle from '../components/UI/mainTitle/mainTitle.tsx';
import SubmitGlacier from '../components/UI/map/SubmitGlacier.tsx';
import Calculator from './Calculator.tsx';
import About from './about/About.tsx';
import Example from './example/Example.tsx';

const Home = () => {
  return (
    <>
      <MainTitle />
      <div id="submit-glacier">
        <SubmitGlacier />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="calculator">
        <Calculator />
      </div>
      <div id="examples">
        <Example />
      </div>
    </>
  );
};

export default Home;
