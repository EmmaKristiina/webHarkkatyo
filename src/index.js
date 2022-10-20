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
  const JQ = {
    query: [
      {
        code: "Alue",
        selection: {
          filter: "item",
          values: ["000000"]
        }
      },
      {
        // Valitaan mukaan puoluut jotka ovat säännöllisesti saaneet kansanedustajia
        code: "Puolue",
        selection: {
          filter: "item",
          values: ["04", "02", "03", "01", "05", "06", "07", "08"]
        }
      },
      {
        code: "Puolueiden kannatus",
        selection: {
          filter: "item",
          values: ["Sar2"]
        }
      },
      {
        code: "Sukupuoli",
        selection: {
          filter: "item",
          values: ["S"]
        }
      }
    ],
    response: {
      format: "json-stat2"
    }
  };

  // Async funktio datan hakemiseen
  const getData = async () => {
    // datan Url osoite
    const url =
      "https://statfin.stat.fi:443/PxWeb/api/v1/en/StatFin/evaa/020_evaa_2019_tau_120.px";
    // Datan fetchaus await funktion avulla
    const datapromise = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(JQ)
    });
    // Tsekataan onko datan haku epäonnistunut
    if (!datapromise.ok) {
      return;
    }
    // Jos datan haku onnistunut palautetaan json data
    const dataJson = await datapromise.json();
    return dataJson;
  };

  const newChart = async () => {
    const data = await getData();
    // Valitaan halutut data yksiköt ja muunnetaan ne objekteista ne listoiksi
    const parties = Object.values(data.dimension.Puolue.category.label);
    const years = Object.values(data.dimension.Vuosi.category.label);
    const values = data.value;

    // Liitetään oikealle puolueelle oikeat kannatusluvut
    parties.forEach((party, ind) => {
      let partyVotes = [];
      // Dataa on kymmenen eri vuoden ajalta, otetaan kaikki vuodet mukaan tarkasteluun
      for (let i = 0; i < 10; i++) {
        // Valitaan oikealle puolueelle oikeat arvot listasta
        // i*8+ind ==> joka kahdeksas arvo on yhden puolueen yhden vuoden kannatus luku
        partyVotes.push(values[i * 8 + ind]);
      }
      // Kuvajaa ottaa vastaan tiedot objekteina joten tehdään tuloksista objekti,
      // jonka toinen lähtötieto on puolueen nimi ja toinen on kannatusluku
      // ind kertoo puolueen jonka kannatusluku on kyseessä
      parties[ind] = {
        name: party,
        values: partyVotes.reverse() // reverse kääntää kannatus luvut listassa oikein päin
      };
    });

    // Luodaan frappe chartin käyttämä datasetti
    const chartInput = {
      // Määritetään kuvaajan x-akseliksi vuodet joilta dataa on
      labels: years,
      // Ja y-akselin arvot tulevat äsken tehdystä parties objektista jossa ensimmäinen arvo kertoo puoluee ja toinen on kannatusluvut eri vuosille
      datasets: parties
    };
    // Luodaan kuvaaja
    const chart = new Chart("#chart", {
      title: "Puolueiden kannatus eduskuntavaaleissa",
      data: chartInput,
      type: "line",
      height: 350,
      // Käytetään puolueiden kuvaamiseen niiden värejä
      colors: [
        "#f54b4b",
        "#ffde55",
        "#006288",
        "#349a2b",
        "#61bf1a",
        "#f00a64",
        "#ffdd93",
        "#0135a5"
      ],
      lineOptions: {
        regionFill: 0
      }
    });
  };

  newChart();
}
