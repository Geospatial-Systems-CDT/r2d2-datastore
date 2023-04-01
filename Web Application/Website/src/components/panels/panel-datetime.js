import { useState } from 'react';
import { randHash } from '../../util';

function useForceUpdate() {
    // eslint-disable-next-line
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

function DateTimePanel() {
    const forceUpdate = useForceUpdate();

    return {
        render:
            <div>
                <button onClick={forceUpdate}>Update</button>
                <span>Now: {new Date().toISOString()}</span>
            </div>,
        params: { i: "datetime-" + randHash(), w: 2, h: 1 },
    }
}

export default DateTimePanel;