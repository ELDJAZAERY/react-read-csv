/** 
 *
 * site = {
 *  location : '',
 *  admin    : '',
 *  contact : {
 *    name     : '',
 *    contact1 : '',
 *    contact2 : '',
 *  }
 * } 
 * 
 * converted structur of ips for state
 * const sites={
   ips:['192.168.50'],
   '192.168.50':{
       r,
       l,
       c1,
       c2
   }
}

 * 
 * 
 * 
 * warning || error = {
 *   desc     : '', // description 
 *   nbLine   :  // numero de ligne
 *   nbColomn : 
 * }
 * 
 * 
 */


const converter = (sites) => {
    let converted = sites.reduce((converted, siteInfo) => {
        return {
            ...converted,
            ips : [...converted.ips,...siteInfo.ips],
            ...siteInfo.ips.reduce((accum,ip)=>{
                let injectedSiteInfo = {...siteInfo}
                delete injectedSiteInfo.ips
                return {
                    ...accum,
                    [ip] : injectedSiteInfo
                }
            },{}),
        }
        },{ips : []})

    return converted;
}


// export const converter = (sites = {}, action) => {
//     switch (action.type) {
//         case 'UPDATE_SITES':
//             return action.payload
//         default:
//             return state
//     }
// }



export default function check(csvData) {

    function stringToMatrix(string) {
        let matrix = string.split('\n')
        matrix = matrix.map((line) => {
            return line.split(',')
        })

        return matrix
    }

    csvData = stringToMatrix(csvData);

    const NBROWSREQUIRES = 1;
    const NBTOTALCOLOUMS = 4;
    const TITLES = ['Location du site', 'Nom du Responsable', 'Contact', 'Contact 2']
    const KEYS = ['location', 'responsable', 'contact', 'contact2']



    let warnings = []
    let errors = []


    // Array of site
    let sites = [];

    let nbLine = 0


    /** ### filter csvData and catch the warnings and errors  ### **/
    let data = csvData.filter((line) => {
        nbLine++;
        let nbColomn = 0;

        // filter the Header
        if (nbLine === 1) return false;

        // Last line always be empty
        if (nbLine === csvData.length && line.length === 1 && line[0] === "") {
            // scape the last empty line
            return false;
        }

        if (line.length < NBROWSREQUIRES) {
            errors.push({
                desc: TITLES[line.length] + ' est requis',
                nbLine,
                nbColomn,
            })

            // scape this line
            return false;
        }

        let keep = true;
        line.map((row) => {
            nbColomn++;

            if (nbColomn <= NBROWSREQUIRES && row === "") {
                errors.push({
                    desc: TITLES[nbColomn - 1] + ' est requis',
                    nbLine,
                    nbColomn,
                })
                keep = false;
            }

            if (nbColomn > NBROWSREQUIRES && nbColomn <= NBTOTALCOLOUMS && row === "") {
                warnings.push({
                    desc: TITLES[nbColomn - 1] + ' manquant',
                    nbLine,
                    nbColomn,
                })
            }
        })

        return keep;
    })


    sites = data.map((rows) => {
        let site = {}

        for (let i = 0; i < NBTOTALCOLOUMS; i++) {
            site = { ...site, [KEYS[i]]: rows[i] }
        }

        // IPS
        let ips = []
        for (let i = NBTOTALCOLOUMS; i < rows.length; i++) {
            if (!ips.includes(rows[i]) && rows[i] !== "") ips.push(rows[i])
        }

        site = { ...site, ips }
        return site;
    })

    sites = converter(sites);
    return { sites, errors, warnings }
}