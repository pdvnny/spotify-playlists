/* 
    I MOVED THE CONTENT THAT I PLANNED FOR THIS
    PAGE TO THE "HOME" PAGE

*/

// import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Container, Button } from 'react-bootstrap';

function League() {

    // CAN I LOAD LEAGUES FROM A DATABASE HERE?

    return(
        <div className="App d-grid gap-2">
            <Container>
                <h1>Current Leagues</h1>
                <Button variant="primary">Current League 1</Button>
                <Button variant="primary">Current League 2</Button>
            </Container>

            <Container>
                <h1>Current Leagues</h1>
                <Button variant="secondary">Recent League 1</Button>
                <Button variant="secondary">Recent League 2</Button>
            </Container>
        </div>
    );
}

export default League;
