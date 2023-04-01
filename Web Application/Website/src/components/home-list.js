import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';

function BasicExample() {
    const navigate = useNavigate();
  return (
   
    <Nav 
    onSelect={selected=> {
        console.log(selected)
        navigate('/'+selected)
    }}
    className='title-list'
    >
      <Nav.Item>
      <i className="fa fa-fw fa-fire" style={{ fontSize: '1.5em' }} />
        <Nav.Link href="/fire">Fire</Nav.Link>
      </Nav.Item>

      <Nav.Item>
      <i className="fa fa-fw fa-bolt" style={{ fontSize: '1.5em' }} />
        Power Network

        <Nav.Item>
            ------ <Nav.Link href="/power/distribution"> Power Distribution</Nav.Link>
        </Nav.Item>

        <Nav.Item>
            ------ <Nav.Link href="/power/outages"> Power Outages</Nav.Link>
        </Nav.Item>

      </Nav.Item>

      <Nav.Item>
      <i className="fa fa-fw fa-snowflake" style={{ fontSize: '1.5em' }} />
        <Nav.Link href="/cold">Cold Weather</Nav.Link>
      </Nav.Item>

    </Nav>
  );
}



export default BasicExample;