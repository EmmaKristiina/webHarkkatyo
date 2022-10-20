import "./styles.css";

let areas = {};
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

    const cities = Object.values(temp);
    const population = Object.values(temp1);
    const employment = Object.values(temp2);
    let i = 0;
    cities.forEach((area, areaIndex) => {
      var per, rounded, c;
      per = (employment[i] / population[i]) * 100;
      rounded = per.toFixed(2);
      areas[area] = {
        unemployment: rounded
      };
      i++;
    });
    //console.log(areas["Lappeenranta"].unemployment);
    return areas;
  }

  getEmploymentData();
  // Haetaan kartalle kuntion rajat
  async function getMapdata() {
    const url =
      "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const dataPromise = await fetch(url);
    const dataJson = await dataPromise.json();
    //console.log(dataJson);
    makeMap(dataJson);
    //console.log(dataJson);
  }
  // Luodaan kartta ja lisätään siihen haetut kuntarajat ja kuntien nimet
  function makeMap(data) {
    let map = L.map("map", {
      minZoom: -10
    });

    let geoJson = L.geoJSON(data, {
      onEachFeature: getDataOnMAp
    }).addTo(map);

    // Listään open street map jotta kartta näyttää fiksummalta
    let osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 15,
        _attribution: "© OpenStreetMap",
        get attribution() {
          return this._attribution;
        },
        set attribution(value) {
          this._attribution = value;
        }
      }
    ).addTo(map);

    map.fitBounds(geoJson.getBounds());
  }

  // Kunnan nimi näkyy kun mennään hiirellä kunnan päälle
  const getDataOnMAp = (feature, layer) => {
    let name = feature.properties.nimi;
    name = name.toString();
    layer.bindPopup(
      `<ul>
      <li>Name: ${name} </li>
      <li>unemployment ${areas[name].unemployment}  </li>
  </ul>`
    );
    // layer.bindPopup(name" suurin puolue " puolue);
    layer.on("mouseover", function (e) {
      this.openPopup();
    });
    layer.on("mouseout", function (e) {
      this.closePopup();
    });
  };

  getMapdata();
}

/*const municipalityData = async () => {
    const data = await getData2();
    const parties = Object.values(data.dimension.Puolue.category.label);
    const years = Object.values(data.dimension.Vuosi.category.label);
    const municipality = Object.values(data.dimension.Alue.category.label);
    const values = data.value;

    console.log(data);
    // Käydään kaikki alueet läpi yhdellä alueella on 80 datapistettä joten
    // Alue 1 aloittaa ensimmäisestä datasolusta ja kunta 2 aloittaa +80 datasolusta jne

    let j = 0;
    let startpoint = 0;

    municipality.forEach((M, index) => {
      // Käydään kaikki kunnat läpi vuodelta 2019 ja etsitään puolue joka on saanut suurimman kannatuksen
      // Kahdeksan puoluetta jotka käydään
      // Valitaan slice funktiolla yhden vuoden pätkä kunnan datasta
      // Eli aloitus piste + kahdeksan datapistettä
      const temp = values.slice(startpoint, startpoint + 8);
      // Etsitään tästä pätkästä suurin arvo ja valitaan sen indeksi
      let i = temp.indexOf(Math.max.apply(null, temp));
      i = i + 1;
      let text2 = i.toString();
      let text1 = "0";
      let text = text1.concat(text2);
      municipality[index] = {
        area: M,
        values: text
      };

      j = j + 1;
      // Yhdellä alueella on aina 8 datapistettä
      //joten siirretään tarkastelu pistettä aina yhden alueen jälkeen 8 datapistettä eteenpäin
      startpoint = j * 8;

      return municipality;
    });
  };
*/

/*const JQ2 = {
    query: [
      {
        code: "Alue",
        selection: {
          filter: "item",
          values: [
            "010091",
            "020018",
            "020049",
            "020078",
            "020092",
            "020106",
            "020149",
            "020186",
            "020224",
            "020235",
            "020245",
            "020257",
            "020407",
            "020434",
            "020444",
            "020504",
            "020505",
            "020543",
            "020611",
            "020616",
            "020638",
            "020710",
            "020753",
            "020755",
            "020858",
            "020927",
            "030000",
            "030019",
            "030202",
            "030284",
            "030304",
            "030322",
            "030400",
            "030423",
            "030430",
            "030445",
            "030480",
            "030481",
            "030503",
            "030529",
            "030538",
            "030561",
            "030577",
            "030631",
            "030636",
            "030680",
            "030704",
            "030734",
            "030738",
            "030761",
            "030833",
            "030853",
            "030895",
            "030918",
            "040000",
            "040050",
            "040051",
            "040079",
            "040099",
            "040102",
            "040181",
            "040214",
            "040230",
            "040271",
            "040484",
            "040531",
            "040608",
            "040609",
            "040684",
            "040747",
            "040783",
            "040886",
            "060016",
            "060061",
            "060081",
            "060082",
            "060086",
            "060098",
            "060103",
            "060109",
            "060111",
            "060165",
            "060169",
            "060316",
            "060398",
            "060433",
            "060560",
            "060576",
            "060694",
            "060781",
            "060834",
            "060981",
            "070020",
            "070108",
            "070143",
            "070177",
            "070211",
            "070250",
            "070418",
            "070508",
            "070536",
            "070562",
            "070581",
            "070604",
            "070619",
            "070635",
            "070702",
            "070790",
            "070837",
            "070887",
            "070908",
            "070922",
            "070936",
            "070980",
            "080000",
            "810000",
            "820000",
            "080046",
            "080075",
            "080090",
            "080097",
            "080142",
            "080153",
            "080171",
            "080178",
            "080213",
            "080285",
            "080286",
            "080405",
            "080416",
            "080441",
            "080489",
            "080491",
            "080507",
            "080580",
            "080588",
            "080593",
            "080623",
            "080624",
            "080681",
            "080689",
            "080700",
            "080739",
            "080740",
            "080768",
            "080831",
            "080935",
            "090140",
            "090146",
            "090167",
            "090176",
            "090204",
            "090239",
            "090260",
            "090263",
            "090276",
            "090297",
            "090309",
            "090402",
            "090420",
            "090422",
            "090426",
            "090541",
            "090595",
            "090607",
            "090686",
            "090687",
            "090707",
            "090749",
            "090762",
            "090778",
            "090844",
            "090848",
            "090857",
            "090911",
            "090915",
            "090921",
            "090925",
            "100000",
            "100005",
            "100010",
            "100052",
            "100074",
            "100145",
            "100151",
            "100152",
            "100217",
            "100218",
            "100231",
            "100232",
            "100233",
            "100236",
            "100272",
            "100280",
            "100287",
            "100288",
            "100300",
            "100301",
            "100399",
            "100403",
            "100408",
            "100421",
            "100440",
            "100475",
            "100499",
            "100545",
            "100584",
            "100598",
            "100599",
            "100743",
            "100759",
            "100846",
            "100849",
            "100893",
            "100905",
            "100924",
            "100934",
            "100946",
            "100989",
            "110077",
            "110172",
            "110179",
            "110182",
            "110216",
            "110226",
            "110249",
            "110256",
            "110265",
            "110275",
            "110291",
            "110312",
            "110410",
            "110435",
            "110495",
            "110500",
            "110592",
            "110601",
            "110729",
            "110850",
            "110892",
            "110931",
            "110992",
            "120009",
            "120069",
            "120071",
            "120072",
            "120105",
            "120139",
            "120205",
            "120208",
            "120244",
            "120290",
            "120305",
            "120317",
            "120425",
            "120436",
            "120483",
            "120494",
            "120535",
            "120563",
            "120564",
            "120578",
            "120615",
            "120620",
            "120625",
            "120626",
            "120630",
            "120678",
            "120691",
            "120697",
            "120746",
            "120748",
            "120765",
            "120777",
            "120785",
            "120791",
            "120832",
            "120859",
            "120889",
            "120977",
            "130000",
            "130047",
            "130148",
            "130240",
            "130241",
            "130261",
            "130273",
            "130320",
            "130498",
            "130583",
            "130614",
            "130683",
            "130698",
            "130732",
            "130742",
            "130751",
            "130758",
            "130845",
            "130851",
            "130854",
            "130890",
            "130976",
            "050035",
            "050043",
            "050060",
            "050062",
            "050065",
            "050076",
            "050170",
            "050295",
            "050318",
            "050417",
            "050438",
            "050478",
            "050736",
            "050766",
            "050771",
            "050941"
          ]
        }
      },
      {
        code: "Vuosi",
        selection: {
          filter: "item",
          values: ["2019"]
        }
      },
      {
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

  const getData = async () => {
    // datan Url osoite
    const url =
      "https://pxdata.stat.fi:443/PxWeb/api/v1/fi/StatFin/evaa/020_evaa_2019_tau_120.px";
    // Datan fetchaus await funktion avulla
    const datapromise = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(JQ2)
    });
    // Tsekataan onko datan haku epäonnistunut
    if (!datapromise.ok) {
      return;
    }
    // Jos datan haku onnistunut palautetaan json data
    const dataJson = await datapromise.json();
    return dataJson;
  };

  const municipalityData = async () => {
    const data = await getData();
    const parties = Object.values(data.dimension.Puolue.category.label);
    const areas = Object.values(data.dimension.Alue.category.label);
    const values = data.value;
    //const dataArray = [];

    let j = 0;
    let startpoint = 0;
    // Käydään kaikki kunnat läpi vuodelta 2019
    areas.forEach((area, areaIndex) => {
      const temp = [];
      // Käydään puoluiden kannatusluvut läpi
      parties.forEach((party, partyIndex) => {
        // Ja lopulta etsitään kunnalle ja puolueelle kannatusluku
        // Startpoint on se kohta values listassa mistä kyseisen kunnan arvot alkavat
        // partyindeks puolestaan kertoo monesko puolue on kyseessä
        // Valitaan oikealle puolueelle oikeat arvot listasta
        // i*8+ind ==> joka kahdeksas arvo on yhden puolueen yhden vuoden kannatus luku
        const value = values[startpoint + partyIndex];
        const temp = {
          name: party,
          value: value
        };
      });
      areas[areaIndex] = {
        municipality: area,
        data: temp
      };
      // Jokaisella kunnalla on kahdeksan datapistettä koska jokaisella puolueella on yksi arvo kyseisessä kunnassa
      // Starpoint on siis se arvo josta kyseisen kunnan arvot alkavat. Siirretään siis aina kunnna vaihtuessa starpointtia kahdeksan datapistettä eteenpäin
      j = j + 1;
      startpoint = j * 8;
    });
    console.log(areas);
    return areas;
  };
  */
// Haetaan kartalle kuntion rajat
