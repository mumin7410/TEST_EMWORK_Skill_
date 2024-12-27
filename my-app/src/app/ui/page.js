import Link from "next/link";  // Import Link from next/link

// Define styles outside the component
const styles = {
  templeall: {
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wat: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  imagewatthai2: {
    width:'300px',
    height:'300px'
  }
};

export default function UI() {
  return (
    <div style={styles.templeall} id="temple">
      <div style={styles.imagewatthai2}>
        sdfsdfsd
      </div>
    </div>
  );
}
