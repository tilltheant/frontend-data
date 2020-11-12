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
  const dataready = arraydata(jaardata);


//DE VAriablen voor de visualisatie
  const svg = select('svg');
  const width = +svg.attr('width');
  const height = +svg.attr('height');
  console.log(dataready)

const xScale =scaleLinear()
  .domain([0, 20])
	.range([0,width]);

const yScale = scaleBand()
	//.domain(dataready.map( d => Object.keys(dataready.kleur)))
	// .range();

console.log(yScale.domain());

//DE VISUALISATIE

//const newData = dataready.filter(data => data.jaartal === "2011")
//console.log(newData)

 // if (typeof Object.keys(newData.kleur) !== 'undefined' && Object.keys(newData.kleur).length > 0) {
 //       // You have an array
 //   console.log("het is gelukt")}
//console.log(Object.values(newData.kleur))

	svg.selectAll("rect")
    .data(dataready)
    .enter().append("rect")
          .attr("height", d => {
            if (d.kleur.ROOD) {
							return xScale(d.kleur.ROOD)
            } else return 0

       })
          .attr("width",350);

})
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

//samen met sjors gemaakt
//de object omzetten naar een array door een nieuwe let aan te maken
// en
function arraydata (jaardata){
   return Object.keys(jaardata).map(jaar => {
    	let data = {};
			data.jaartal = jaar,
      data.kleur = jaardata[jaar]
    return data
    }

)}

//hele dataset filteren en in een array zetten
function filterenhelearray (data){
  return data.map(uitkomst => uitkomst)
}
