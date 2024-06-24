import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const Heading = styled.div`
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    color: #007bff;
  }
`;

export const Paragraph = styled.div`
  padding: 10px 0;
  font-size: 16px;
`;

export const CollapsibleContent = styled.div`
  margin-left: 20px;
  padding: 10px;
  border-left: 2px solid #ddd;
`;
