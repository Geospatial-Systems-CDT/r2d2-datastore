import { Link } from "react-router-dom";

import { usePageTitle } from '../util';

function Home({ navigation }) {
    usePageTitle("Home");

    return <div className='page'>
        <h1>Welcome to R2-D2</h1>

        <div class="home-grid">
            <Link to="/snow" aria-label="Snow" class="theme-snow"><i class="fa fa-fw fa-snowflake"></i>Low Temperature & Heavy Snow</Link>
            <Link to="/electricity" aria-label="Electricity" class="theme-electricity"><i class="fa fa-fw fa-bolt"></i>Electricity Transmission</Link>
            <Link to="/fire" aria-label="Fire" class="theme-fire"><i class="fa fa-fw fa-fire"></i>Major Waste Fire Risk Sites</Link>
        </div>

</div>
}
export default Home;