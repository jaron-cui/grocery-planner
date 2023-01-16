import { Text, TouchableOpacity } from "react-native"

const TextButton = (props: any) => {
  return (
    <TouchableOpacity {...props} style={{
        backgroundColor: 'cyan',
        borderRadius: '5px',
        padding: '5px',
        alignItems: 'center',
        ...props.style
      }}>
      <>
        {props.title && props.title}
        {props.children}
      </>
    </TouchableOpacity>
  );
}

export default TextButton;