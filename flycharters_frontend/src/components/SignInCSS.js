 import styled from 'styled-components';
import SigninImage from '../assets/airplanenav.png';


 export const Container = styled.div`
 background-color: rgba(255, 255, 255);
 border-radius: 10px;
 box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
 position: relative;
 overflow: hidden;
 width: 950px;
 max-width: 100%;
 min-height: 570px;
 padding-bottom: 10px;
 `;

 export const SignUpContainer = styled.div`
 background-color: rgba(11, 85, 102, 0.2);
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${props => props.signinIn !== true ? `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  ` 
  : null}
 `;
 

 export const SignInContainer = styled.div`
 position: absolute;
 top: 0;
 height: 100%;
 transition: all 0.6s ease-in-out;
 left: 0;
 width: 50%;
 z-index: 2;
 ${props => (props.signinIn !== true ? `transform: translateX(100%);` : null)}
 `;
 
 export const Form = styled.form`
 background: radial-gradient(circle at center, #ffffff 0%,rgb(249, 249, 249,0.2) 60%,rgb(243, 246, 247,0.2) 100%);

 display: flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 padding: 0 50px;
 height: 100%;
 text-align: center;
 `;

 export const SignUpForm = styled(Form)`
  justify-content: flex-start;
  padding: 15px 40px;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

 
 export const Title = styled.h1`
 font-size: 2rem;
 text-align: center;
 font-weight: bold;
 margin: 0;
  color: rgb(8, 71, 147);
 `;
 
export const Input = styled.input`
  background: #fff;
  border: 1px solid #ccc;
  padding: 6px 10px;
  margin: 4px 0;
  width: 100%;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;

  &::placeholder {
    color: #999;
    font-style: normal;
  }

  &:hover {
    border-color: rgb(29, 102, 102);
    box-shadow: 0 0 6px rgba(29, 102, 102, 0.2);
  }

  &:focus {
    outline: none;
    border-color: rgb(15, 26, 26);
    box-shadow: 0 0 8px rgba(15, 26, 26, 0.3);
  }
`;

export const Button = styled.button`
  border-radius: 20px;
  border: 1px solid rgb(11, 11, 11);
  background: linear-gradient(to right, rgb(125, 168, 176), rgb(9, 82, 82));
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

export const GhostButton = styled.button`
  background: transparent;
  border: 1px solid #061953;
  color: #061953;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 30px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(6, 25, 83, 0.1);
    color: #061953;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }
`;

 export const Anchor = styled.a`
 color: #333;
 font-size: 14px;
 text-decoration: none;
 margin: 15px 0;
 `;
 export const OverlayContainer = styled.div`
position: absolute;
top: 0;
left: 50%;
width: 50%;
height: 100%;
overflow: hidden;
transition: transform 0.6s ease-in-out;
z-index: 100;
${props =>
  props.signinIn !== true ? `transform: translateX(-100%);` : null}
`;

export const Overlay = styled.div`
  ${'' /* background-image: url('/gptfalcon2.png');
  background-color: rgba(255, 255, 255, 0.1); // Optional overlay */}
   ${'' /* background-color: rgba(255, 255, 255, 0.1);  */}
  ${'' /* background-image: none; */}
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${props => (props.signinIn !== true ? `transform: translateX(50%);` : null)}
`;
 
export const OverlayPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* Push content to top and bottom */
  padding: 1rem;
  text-align: center;
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;

  h1 {
    font-size: 3rem;
    margin-bottom: 5.5rem;
    margin-top: 0.5rem; /* Push the welcome text up */
  }

  p {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  button {
    align-self: center;
    margin-bottom: 4rem; /* Push button lower */
  }
`;

 export const LeftOverlayPanel = styled(OverlayPanel)`
   transform: translateX(0%);
   background-image: url(${SigninImage});
     background-size: cover;
     background-position: center;
   ${props => props.signinIn !== true ? `transform: translateX(20);` : null}
 `;

 export const RightOverlayPanel = styled(OverlayPanel)`
     right: 0;
     transform: translateX(0);
     background-image: url(${SigninImage});
     background-size: cover;
     background-position: center;
     ${props => props.signinIn !== true ? `transform: translateX(0%);` : null}
 `;

 export const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 200;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 20px 30px;

  background: linear-gradient(to right,rgb(13, 42, 48),rgb(9, 9, 9));
  -webkit-background-clip: text;  
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 24px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  color: #003366;
  font-size: 20px;
  font-weight: bold;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;

  &:hover {
    background: #e0e0e0;
  }
`;


export const OverlayGhostButton = styled(GhostButton)`
  background-color: rgba(0, 51, 102, 0.25);
  border: 1px solid #fff;
  color: #fff;
  -webkit-text-fill-color: unset; /* Reset text clipping for white text */
  background-clip: border-box;
  font-weight: 600;
  padding: 12px 45px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.25); // #003366
    border: 1px solid #003366;
    transform: scale(1.05);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  margin: 10px 0;

  &:focus {
    border-color: rgb(15, 26, 26);
    box-shadow: 0 0 8px rgba(15, 26, 26, 0.3);
    outline: none;
  }
`;


export const SignInForm = styled(Form)`
  justify-content: center;
  padding: 20px 40px;
  overflow-y: auto;

  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;


export const RadioWrapper = styled.div`
  display: flex;
  align-items: center;
  
  input[type='radio'] {
    margin-right: 8px;
    accent-color: #003366;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  label {
    font-size: 14px;
    color: #333;
    cursor: pointer;
  }
`;