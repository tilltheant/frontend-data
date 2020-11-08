
//ophalen data van alle autos met hun kleur
const kentekenautos = "https://opendata.rdw.nl/resource/m9d7-ebf2.json";

//json met alle automerken
const merkarray = merk;



async function getData(){
  const data = await dataophalen(kentekenautos)
  const filtered = filterenhelearray(data)
  const combinedData = filtered.map(item => {
    return {
      carbrands: item.merk,
      carcolor: item.eerste_kleur
    }
  })
  console.log(combinedData)
}



getData().then(resultaat => console.log(resultaat))


async function dataophalen(url) {
  const antwoord = await fetch(url)
  const data = await antwoord.json (url)
  return data
}


function filterenhelearray (data){
  return data.map(uitkomst => uitkomst)
}
