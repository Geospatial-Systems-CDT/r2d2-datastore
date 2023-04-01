import { Link } from "react-router-dom";

function CommonHeader() {

    return <header>
        <nav>
            <ul>
                <li key="snow" className="theme-snow"><Link to="/snow" aria-label="Snow"><i className="fa fa-fw fa-snowflake"></i></Link></li>
                <li key="elec" className="theme-electricity"><Link to="/electricity" aria-label="Electricity"><i className="fa fa-fw fa-bolt"></i></Link></li>
                <li key="fire" className="theme-fire"><Link to="/fire" aria-label="Fire"><i className="fa fa-fw fa-fire"></i></Link></li>
                <li key="form"><a href="https://odk.r2d2.systems/-/single/WIOSjoNBpaSfxgoULr1hK58WrpHNrwl?st=ctb4yhyaI3YZPEctU7TxpCwWqTpz1KSj9i2KHE1eS7zMKyCXc41Si0!VrMW!AehY" aria-label="Report Issue"><i className="fa fa-fw fa-triangle-exclamation"></i></a></li>
                <li key="twittermap"><a href="http://twittermap.r2d2.systems" aria-label="Twitter Map"><i className="fa fa-brands fa-twitter"></i></a></li>
            </ul>
        </nav>

        <Link to="/"><img src="/assets/banner-r2d2.png" alt="R2D2 logo" className="logo" /></Link>
        <img src="/assets/banner-background.png" alt="" role="presentation" />
    </header>
}

export default CommonHeader;