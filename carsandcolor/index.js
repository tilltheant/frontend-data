import {
  select,
  csv,
  scaleLinear,
  max,
  scaleBand,
  axisLeft,
  axisBottom,
  format
} from 'd3';
//ophalen data van alle autos met hun kleur
const kentekenautos = "https://opendata.rdw.nl/resource/m9d7-ebf2.json";



//wachten op de data en dan de data tellen
getData().then(resultaat => {
  const jaardata = count(resultaat)





  console.log(jaardata)
})










//ophalen van de data, met async wachten totdat de data binnenisgehaald in een json
//vervolgens filteren naar een andere array door eroverheen te mappen
//dan de gefilterede data weer filteren op datum(alleen het jaartal de eerste 4 letters) en kleur
async function getData(){
  const data = await dataophalen(kentekenautos)
  const filtered = filterenhelearray(data)
  const combinedData = filtered.map(item => {
    return {
      year: item.datum_eerste_toelating.substring(0, 4),
      color: item.eerste_kleur
    }
  })
  return combinedData;
}

// de data ophalen en wachten op een antwoord voordat die verder gaat, vervolgens de data omzetten naar een json
async function dataophalen(url) {
  const antwoord = await fetch(url)
  const data = await antwoord.json(url)
  return data
}


// samen met gijs gemaakt tellen van de jaartallen en kleuren per jaartal
function count (merkarray){
  const countobject = {};

  merkarray.forEach(item => {
    //destructuring const voor overzichtlijkheid.
    const { color, year } = item

    //tellen van de jaartal, kleur en vervolgens in countobject zetten per jaartal
    if (countobject[year] && countobject[year][color]) {
      countobject[year][color]++
    } else {
        if (color === 'N.v.t.') {return}
//als countobject true is then countobject = 1
      if (!countobject[year]) {
        countobject[year] = {}
        }

      countobject[year][color] = 1
    }
  })
  return countobject;
}

//hele dataset filteren en in een array zetten
function filterenhelearray (data){
  return data.map(uitkomst => uitkomst)
}