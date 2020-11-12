//ophalen data van alle autos met hun kleur
const kentekenautos =
  'https://opendata.rdw.nl/resource/m9d7-ebf2.json?$limit=10000';








//wachten op de data, vervolgens tellen en in een array zetten,
//sorteren per jaartal en vervolgens visualiseren.
//---------------------------------------------------------------------------------------------------
getData().then((resultaat) => {
  const jaardata = count(resultaat);
  const sortedData = jaardata.sort(sortByYear);
  datavismaken(sortedData);
});












//de visualisatie!!! bron: https://www.d3-graph-gallery.com/graph/barplot_button_data_hard.html
//---------------------------------------------------------------------------------------------------
function datavismaken(sortedData) {
  // vast margin voor hergebruik
  const margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 560 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // koppelen van de html svg en aanmaken van de attri aan de svg
  let svg = d3
    .select('#my_dataviz')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Maken X As
  let x = d3.scaleBand().range([0, width]).padding(0.2);
  let xAxis = svg.append('g').attr('transform', 'translate(0,' + height + ')');

  // maken Y As
  let y = d3.scaleLinear().range([height, 0]);
  let yAxis = svg.append('g').attr('class', 'myYaxis');

  //text toevoegen aan de SVG
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', 0 - margin.top / 10)
    .attr('text-anchor', 'middle')
    .style('font-size', '20px')
    .style('text-decoration', 'none')
    .text("Meest verkochte auto's per kleur");


  // functie maken die de data update op basis van de gegeven data
  //---------------------------------------------------------------------------------------------------
  function update(dataJaareen) {
    console.log(dataJaareen);
    let data = dataJaareen.data;

    // Update the X axis
    x.domain(
      data.map(function (d) {
        return d.color;
      })
    );
    xAxis.call(d3.axisBottom(x));

    // Update the Y axis
    y.domain([
      0,
      d3.max(data, function (d) {
        return d.value;
      }),
    ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // maak nieuwe let
    let change = svg.selectAll('rect').data(data);
//met merge() combineer je de UPDATE en ENTER samen zodat het een geheel is
    change
      .enter()
      .append('rect') // Add a new rect for each new elements
      .merge(change) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(1000)
      .attr('x', function (d) {
        return x(d.color);
      })
      .attr('y', function (d) {
        return y(d.value);
      })
      .attr('width', x.bandwidth())
      .attr('height', function (d) {
        return height - y(d.value);
      })
      .attr('fill', '#69b3a2');

    // If less group in the new dataset, I delete the ones not in use anymore
    change.exit().remove();
  }

  // Initialize the plot with the first dataset
  update(sortedData[72]);

  d3.selectAll("input[name='years']").on('change', function () {
    if (this.value == 2016) {
      update(sortedData[60]);
    } else {
      update(sortedData[72]);
    }
  });
}











//FUNCTIES
//---------------------------------------------------------------------------------------------------

//ophalen van de data, met async wachten totdat de data binnenisgehaald in een json
//vervolgens filteren naar een andere array door eroverheen te mappen
//dan de gefilterede data weer filteren op datum(alleen het jaartal de eerste 4 letters) en kleur
async function getData() {
  const data = await dataophalen(kentekenautos);
  const filtered = filterenhelearray(data);
  const combinedData = filtered.map((item) => {
    return {
      year: item.datum_eerste_toelating.substring(0, 4),
      color: item.eerste_kleur,
    };
  });
  return combinedData;
}

// de data ophalen en wachten op een antwoord voordat die verder gaat, vervolgens de data omzetten naar een json
async function dataophalen(url) {
  const antwoord = await fetch(url);
  const data = await antwoord.json(url);
  return data;
}

//zoeken naar het year in de object van RDW als die true is dan return hij die waarde
function findYearIndex(yearItem, array) {
  return array.findIndex((item) => yearItem.year === item.year);
}

// samen met gijs gemaakt tellen van de jaartallen en kleuren per jaartal
function count(array) {
  // Create a new array called yearlyData
  const yearlyData = [];

  // Loop through all our items in our json fetch, they all have their own individual year & color value
  // We need to assign them to the right year by finding their index's
  array.forEach((item) => {
    //destructuring const voor overzichtlijkheid.
    const { color, year } = item;

    // Find index of this year, if it's -1 make a new object.
    const yearIndex = findYearIndex(item, yearlyData);

    // If the year is not indexed yet, create a new object inside the year array.
    if (yearIndex < 0) {
      yearlyData.push({
        year: item.year,
        data: [
          {
            color: item.color,
            value: 1,
          },
        ],
      });
    } else {
      // Add this item's data to the corrosponding year
      // Get the index of the color data
      // Check if the color exists, if yes add up one to the value or otherwise create new object with value 1
      const colorData = yearlyData[yearIndex].data;
      const colorIndexInYear = colorData.findIndex(
        (color) => color.color === item.color
      );

      if (colorIndexInYear < 0) {
        colorData.push({
          color: item.color,
          value: 1,
        });
      } else {
        colorData[colorIndexInYear].value++;
      }
    }
  });

  return yearlyData;
}

//hele dataset filteren en in een array zetten
function filterenhelearray(data) {
  return data.map((uitkomst) => uitkomst);
}

//sorteren op jaar, door de strings naar numbers te veranderen || samen met gijs gemaakt.
function sortByYear(a, b) {
  const yearA = Number(a.year);
  const yearB = Number(b.year);

  if (yearA < yearB) return -1;
  if (yearA > yearB) return 1;
  return 0;
}
