import {range, pipe, map} from "npm:rxjs@7.8.1";

const obs = range(1,100)
    .pipe(
        map(x => x * 2)
    );
obs.subscribe(x => console.log(x));