import "./styles.css";
// Lisätään frappe kuvaajat
import { Chart } from "frappe-charts";
// Käytetään initilize funktiota jotta voidaan varmistaa sivun olevan latautunut ennen kuin suoritetaan koodia pidemmälle
if (document.readyState !== "loading") {
  console.log("valmis");
  initialize();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("else valmis");
    initialize();
  });
}

function initialize() {
  async function getEmploymentData() {
    const url =
      "https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff";
    const dataPromise = await fetch(url);
    const dataJSON = await dataPromise.json();
    const url2 =
      "https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065";
    const datapromise2 = await fetch(url2);
    const dataJSON2 = await datapromise2.json();

    const temp = dataJSON.dataset.dimension.Alue.category.label;
    const temp1 = dataJSON.dataset.value;
    const temp2 = dataJSON2.dataset.value;

    const areas = Object.values(temp);
    const population = Object.values(temp1);
    const employment = Object.values(temp2);
    let i = 0;
    areas.forEach((area, areaIndex) => {
      var per, rounded;
      per = (employment[i] / population[i]) * 100;
      rounded = per.toFixed(2);
      areas[areaIndex] = {
        name: area,
        value: rounded
      };
      i++;
    });
    console.log(areas);
    return areas;
  }

  getEmploymentData();
}
