import axios from 'axios';

// TODO: Pull from terraform
const BASE_URL = process.env.REACT_APP_BASE_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
});

interface NamesResponse {
  Remaining: string[]
  Selected?: string[]
  Rejected?: string[]
  StateId: string
  Counterpart: string
  Email: string
}

interface CreateStateResponse {
  stateId: string
}

export const getNameState = async (id: string): Promise<NamesResponse> => {
  if(process.env.NODE_ENV === "development") {
    return new Promise((resolve) => {
      resolve({"Remaining": ["Bjarnlaugur", "J\u00f6rri", "Arnleifur", "Vigri", "Galdur", "Erasmus", "V\u00e9kell", "Ingvaldur", "Oddur", "Gill", "Hallmann", "\u00de\u00f3rhalli", "D\u00f3maldi", "Hervin", "Mensalder", "Barri", "Alfons", "Sigurbjarni", "Kamilus", "Hl\u00ed\u00f0berg", "Natan", "Fannar", "Gabr\u00edel", "Annar", "Geirvaldur", "J\u00f3nsteinn", "J\u00f3sef", "The\u00f3d\u00f3r", "\u00deormar", "Arnd\u00f3r", "Oliver", "T\u00edstran", "Ragnar", "Sebast\u00edan", "Nor\u00f0mann", "Skafti", "Elbert", "S\u00e6bjartur", "Gils", "Fri\u00f0rik", "Ellert", "Kakali", "Il\u00edes", "Hr\u00e6rekur", "\u00cdvan", "Loki", "Sigurkarl", "H\u00edram", "\u00d3skar", "Gu\u00f0mundur", "Halld\u00f3r", "Sigurfinnur", "Cesar", "Himinlj\u00f3mi", "\u00c1stvin", "Dagn\u00fdr", "Kaj", "Fjalarr", "\u00c1g\u00fast", "\u00cdgor", "Valdimar", "Dorri", "Zakar\u00edas", "Bj\u00f6rn", "H\u00fag\u00f3", "Dalmar", "Dante", "Dar\u00edus", "Sumarli\u00f0i", "Brim\u00fe\u00f3r", "Rasmus", "M\u00f3i", "Brynmar", "Karim", "R\u00fad\u00f3lf", "Bergsteinn", "Brestir", "Jenni", "Marsell\u00edus", "J\u00f6rgen", "Nikanor", "Eldmar", "Bjarkan", "Fossmar", "Valves", "Theod\u00f3r", "Edward", "Hlei\u00f0ar", "Ingibjartur", "Hilar\u00edus", "Karma", "\u00d3narr", "Signar", "Vilbergur", "D\u00fann", "B\u00fari", "L\u00f3renz", "Baui", "Reginbaldur", "Fri\u00f0berg", "Dugf\u00fas", "\u00deorl\u00e1kur", "J\u00f3el", "Nj\u00f6r\u00f0ur", "Bjarnhar\u00f0ur", "Sigurbj\u00f6rn", "Skeggi", "J\u00f3ngeir", "Hagal\u00edn", "Geirhvatur", "Svafar", "Askur", "Garpur", "Valla\u00f0ur", "Greppur", "Yngvar", "\u00derastar", "Sn\u00e6r", "Edgar", "Reyr", "J\u00fan\u00ed", "J\u00f3s\u00faa", "Eyvindur", "\u00c6varr", "Carl", "George", "Kai", "Nonni", "Kapras\u00edus", "Oddmar", "T\u00f3b\u00edas", "Fri\u00f0leifur", "Bjartmar", "Gu\u00f0r\u00e1\u00f0ur", "Fabris\u00edus", "Eir\u00edkur", "Demus", "Go\u00f0i", "Daggeir", "Lauritz", "Imman\u00fael", "Gunnar", "J\u00f3savin", "Willard", "Bergfinnur", "M\u00f3ri", "Leif", "\u00c1stmar", "Kjalar", "N\u00f3el", "Tristan", "Max", "Sveinbj\u00f6rn", "K\u00e1ri", "V\u00f6ttur", "Kveld\u00falfur", "Valberg", "Geiri", "Sigurli\u00f0i", "Jakop", "\u00ddmir", "Sigri", "Engilbjartur", "Ed\u00edlon", "Karl", "Adel", "Allan", "Bill", "Steinkell", "Aldur", "R\u00f3bert", "S\u00f6lvi", "Beinir", "Ali", "Ingibert", "Am\u00edr", "Hildigeir", "H\u00fani", "Eldgr\u00edmur", "Helm\u00fat", "Ingmar", "M\u00e1ni", "H\u00f3lm\u00fe\u00f3r", "Esek\u00edel", "Valmar", "Charles", "Gauti", "Lj\u00f3ni", "Sigur\u00f0ur", "Svani", "\u00c1sbj\u00f6rn", "Tar\u00f3n", "Adr\u00edel", "Kjallakur", "Cecil", "\u00c1rbj\u00f6rn", "\u00c1stgeir", "Kristvar\u00f0ur", "Bergsveinn", "S\u00edrus", "Ludvig", "Hagbert", "Hj\u00e1lmgeir", "\u00deorgautur", "Lars", "Marteinn", "Bolli", "Eyjar", "Sindri", "Steinmann", "\u00deorbrandur", "Skellir", "Gestur", "Svan\u00fe\u00f3r", "Filip", "P\u00e1ll", "Steinmar", "J\u00fan\u00edus", "Au\u00f0geir", "E\u00f0var", "Parmes", "Salvar", "Bjarn\u00f3lfur", "\u00c1st\u00fe\u00f3r", "Smyrill", "Robert", "J\u00f6rundur", "Freyvi\u00f0ur", "Othar", "Tumas", "Engilbert", "Addi", "Vilbogi", "Vilmar", "Art\u00far", "Rafael", "Hugo", "Hafberg", "Bjart\u00fe\u00f3r", "Dennis", "\u00ddrar", "Danel\u00edus", "Hvannar", "Jagger", "\u00de\u00f3rhaddur", "Svanh\u00f3lm", "Sk\u00ed\u00f0i", "Bersi", "Fl\u00f3vent", "Anton\u00edus", "R\u00f6\u00f0ull", "J\u00f6tunn", "Hrolleifur", "Dalbert", "Stapi", "S\u00f3krates", "Steinfinnur", "Gestar", "Arnberg", "Mordeka\u00ed", "Kil\u00edan", "J\u00f3nar", "\u00d3sv\u00edfur", "K\u00f3pur", "Austri", "Sp\u00f3i", "Arngar\u00f0ur", "Matth\u00edas", "H\u00f3lmgr\u00edmur", "Ram", "G\u00f3\u00f0i", "Hallur", "Marri", "\u00c1svaldur", "Steini", "Guttormur", "Muni", "Arn\u00f3r", "Orfeus", "Fri\u00f0mar", "Kaktus", "Ben\u00f3n\u00fd", "A\u00f0albert", "L\u00edam", "\u00dej\u00f3\u00f0rekur", "Vindar", "Gaukur", "Meth\u00fasalem", "Berg", "Aran", "Sigur\u00fe\u00f3r", "S\u00f6rli", "Mark", "Fri\u00f0mundur", "Erling", "B\u00f3i", "Unnd\u00f3r", "Vernhar\u00f0ur", "J\u00f3mar", "Nikolas", "S\u00f3lbergur", "Sk\u00fali", "Aril\u00edus", "Frey\u00fe\u00f3r", "Hall\u00fe\u00f3r", "Damon", "Emir", "Yrkir", "Himri", "Kornel\u00edus", "Geir", "Ingibergur", "Sigfinnur", "Gabriel", "Marten", "Hugleikur", "Matti", "Edvard", "S\u00f3lver", "Tyrfingur", "Dan\u00edval", "Gu\u00f0laugur", "Leon", "Gu\u00f0leikur", "Kalmann", "L\u00f3tus", "Fri\u00f0finnur", "Bj\u00f3lan", "Reynir", "Marbj\u00f6rn", "\u00deorgils", "Berni", "Hj\u00f6rvar", "Oddleifur", "Bjartmann", "\u00dalfur", "Henrik", "Marley", "F\u00edfill", "Per", "Marvin", "Vigf\u00fas", "V\u00edgberg", "Bjarnsteinn", "Borg\u00fe\u00f3r", "Kristvin", "Natan\u00edel", "\u00c1rgils", "Gr\u00edm\u00falfur", "Fjarki", "Freymundur", "\u00d6lver", "Gunnsteinn", "Olavur", "\u00daddi", "Steind\u00f3r", "S\u00e6bergur", "Tj\u00f6rfi", "Gaddi", "Brynjar", "Lj\u00f3tur", "Arnkell", "Franklin", "S\u00f6lvar", "Gilbert", "Sveinn", "Eivin", "T\u00f3i", "B\u00f3t\u00f3lfur", "Marj\u00f3n", "\u00c1str\u00edkur", "Nept\u00fanus", "Peter", "Hr\u00edmnir", "Reykdal", "Falur", "Ismael", "\u00deangbrandur", "Stef\u00e1n", "Bernhar\u00f0ur", "Skuggi", "\u00c1sgeir", "Harri", "B\u00f3as", "Sesar", "Angi", "Kat\u00f3", "Bresi", "\u00deorgar\u00f0ur", "H\u00e1varr", "Lj\u00f3s\u00e1lfur", "Fri\u00f0steinn", "Sk\u00fata", "Alfre\u00f0", "H\u00e1steinn", "\u00c1svar\u00f0ur", "Geirmundur", "Ott\u00f3", "Alvin", "Reifnir", "Vigt\u00fdr", "Trostan", "V\u00edg\u00fe\u00f3r", "Ormsv\u00edkingur", "V\u00edgmar", "Drengur", "L\u00e1r", "Dagmann", "Broddi", "Heilm\u00f3\u00f0ur", "R\u00edkhar\u00f0", "J\u00f6rvi", "Kalman", "Elvar", "Bragi", "Gulli", "Au\u00f0bert", "\u00cdsgeir", "Kolgr\u00edmur", "Steinbj\u00f6rn", "Reinar", "Tindri", "Thorberg", "Arent", "Herj\u00f3lfur", "Hreinn", "Mars", "Sigurvin", "Soffan\u00edas", "Hugberg", "R\u00f6gnvar", "Sigur\u00f3li", "Oddvar", "Mar\u00edon", "Hrollaugur", "\u00deorkell", "Sn\u00e6var", "J\u00e1tgeir", "Koggi", "Hildingur", "\u00de\u00f3rir", "Sigmundur", "Hrafnar", "Ne\u00f3", "R\u00faben", "\u00deorlaugur", "\u00deorsteinn", "Tarfur", "Hj\u00e1lmur", "K\u00f3rekur", "Kast\u00edel", "Oddbj\u00f6rn", "Haddi", "Snj\u00f3laugur", "Hendrik", "Christian", "Ingileifur", "Gl\u00f3i", "G\u00eddeon", "Moritz", "B\u00f6\u00f0var", "Snj\u00f3ki", "Funi", "Starri", "D\u00ed\u00f3medes", "Kristberg", "\u00dej\u00f3\u00f0geir", "Hrafn\u00fe\u00f3r", "\u00d3laf", "Hauksteinn", "J\u00f3hannes", "\u00c1rbjartur", "Fr\u00f3\u00f0i", "Ingvar", "Mark\u00fas", "Fylkir", "Mikkel", "Olgeir", "Oddkell", "\u00c1sberg", "\u00cdsar", "Hringur", "N\u00f3ni", "Ing\u00f3lfur", "Fri\u00f0\u00fej\u00f3fur", "Vilberg", "\u00d6nd\u00f3lfur", "H\u00f6skuldur", "\u00c1sgils", "\u00de\u00f3rarinn", "Mar", "Emman\u00fael", "Evan", "Orri", "Hrafnbergur", "Atlas", "Z\u00f3phon\u00edas", "Lyngar", "R\u00fanar", "V\u00f6r\u00f0ur", "Grani", "R\u00edkar\u00f0ur", "Hreimur", "Hafnar", "H\u00f6gni", "Dexter", "Annel", "Oddbergur", "P\u00e1lmi", "Brynj\u00falfur", "Hinrik", "Illugi", "Hlynur", "Sigursveinn", "Myrkvi", "\u00cds\u00f3lfur", "Aage", "\u00de\u00f3r", "Unn\u00fe\u00f3r", "Andrean", "Marin\u00f3", "Hildigl\u00famur", "Sigurg\u00edsli", "Emerald", "Bjarnfinnur", "Breki", "Holger", "J\u00f3nbjarni", "Fr\u00ed\u00f0steinn", "Gunn\u00f3lfur", "Bj\u00f6rn\u00f3lfur", "Ditt\u00f3", "Dagfinnur", "Ebenezer", "Holgeir", "Mate\u00f3", "H\u00f3lmkell", "Eric", "Adr\u00edan", "Remek", "Stefnir", "Tinni", "Hlj\u00f3mur", "El\u00edn\u00f3r", "Gr\u00e9tar", "Hilbert", "D\u00fdrmundur", "\u00cdsmael", "Ein\u00fe\u00f3r", "Hl\u00e9gestur", "Dengsi", "\u00d3mi", "Dofri", "\u00deorg\u00edsl", "Filippus", "Valur", "L\u00e1rent", "Raknar", "Fr\u00e1r", "\u00c1s\u00fe\u00f3r", "Jens", "Ill\u00edes", "Henning", "Hallmar", "Evert", "Gunnlaugur", "Bj\u00f6rg\u00f3lfur", "Logi", "Skefill", "R\u00f3man", "Gutti", "Arn\u00fe\u00f3r", "Erlendur", "S\u00f3lon", "Dalmann", "L\u00fais", "M\u00f3\u00f0i", "Reginn", "Sveinar", "Sigurmundur", "Freymar", "Arnvi\u00f0ur", "S\u00e6mi", "S\u00f6lmundur", "Bergvin", "Austmar", "Arnoddur", "Ver", "El\u00edott", "Gu\u00f0berg", "Au\u00f0un", "Smi\u00f0ur", "M\u00f3rits", "Leo", "Grankell", "\u00deeyr", "Zophon\u00edas", "\u00cdsid\u00f3r", "Valdemar", "C\u00fdrus", "Hnikar", "Arth\u00far", "Bertel", "R\u00f6gnvaldur", "\u00c1s\u00f3lfur", "Sveinberg", "Efra\u00edm", "Krummi", "V\u00edkingur", "Haukur", "Manfre\u00f0", "H\u00fanr\u00f6\u00f0ur", "V\u00e9geir", "\u00c1smar", "\u00de\u00f3rmar", "H\u00f6r\u00f0ur", "Norbert", "L\u00fakas", "Willum", "Villi", "El\u00ed", "Hersveinn", "Ylur", "\u00dej\u00f3\u00f0ar", "\u00c1sgr\u00edmur", "Kristall", "Hergeir", "Hyltir", "Amon", "Hei\u00f0mann", "Kiddi", "Steinbergur", "S\u00f3lmar", "Reynar\u00f0", "Ad\u00edel", "Konr\u00e1\u00f0", "Feykir", "Lindi", "Galti", "Richard", "Teitur", "Krist\u00f3fer", "Mikkael", "Fengur", "Au\u00f0kell", "J\u00f3mundur", "Kristmann", "Kjaran", "Sn\u00e6h\u00f3lm", "Ei\u00f0ur", "Ylfingur", "M\u00fali", "Lundi", "Sigurgeir", "\u00deorm\u00f3\u00f0ur", "L\u00edus", "Dalli", "Ko\u00f0r\u00e1n", "Bogi", "Gottsk\u00e1lk", "Tumi", "Draupnir", "\u00deorvar\u00f0ur", "S\u00f3fus", "Kolmar", "Ernest\u00f3", "Jochum", "Willy", "\u00c1mundi", "Brimar", "Th\u00f3r", "\u00d3mar", "Spartakus", "Eyberg", "V\u00e1pni", "Amos", "Andri", "Hannes", "M\u00edas", "Evald", "Katar\u00ednus", "Eir", "Kasper", "Sk\u00e6r", "S\u00e6varr", "Fri\u00f0ur", "Kolfinnur", "Hallgar\u00f0ur", "Bjargar", "Hj\u00f6rtur", "S\u00e6valdur", "Vincent", "Vilgeir", "Steinvar\u00f0ur", "Sk\u00e6ringur", "Aaron", "Sam\u00fael", "Kjarval", "\u00c6gir", "\u00deorleifur", "Vakur", "Ei\u00f0ar", "Otri", "T\u00edmon", "Eylaugur", "Brandur", "\u00daranus", "Karli", "\u00de\u00f3rsteinn", "A\u00f0alv\u00edkingur", "Hl\u00f6\u00f0var\u00f0ur", "Maron", "Dreki", "Eyj\u00f3lfur", "L\u00e1rus", "B\u00e6ring", "Gu\u00f0steinn", "Haddur", "\u00cdsbj\u00f6rn", "Fann\u00fe\u00f3r", "H\u00e1rlaugur", "Ebbi", "Ingibj\u00f6rn", "Reinhold", "Svangeir", "\u00cdsmar", "Sturri", "\u00der\u00f6stur", "Vinjar", "Darri", "Hr\u00f3mundur", "S\u00e6mar", "Dvalinn", "Ger\u00f0ar", "Nj\u00e1ll", "M\u00fdrkjartan", "Bessi", "Saxi", "Eggert", "N\u00f3i", "Fr\u00edmann", "V\u00ed\u00f0ir", "Patrik", "Sv\u00e1fnir", "J\u00f6rmundur", "Holti", "J\u00fal\u00edan", "Helgi", "Alexander", "Christopher", "Karkur", "Svanur", "Frost\u00falfur", "Grettir", "Kolbeinn", "Oktav\u00edas", "Vagn", "Oddi", "Eron", "Hr\u00f3aldur", "Sn\u00e6laugur", "H\u00e1lfd\u00e1n", "Eyr\u00edkur", "D\u00f3s\u00f3\u00feeus", "Patrick", "Anthony", "Manuel", "Brj\u00e1nn", "Egill", "Gylfi", "J\u00f3sep", "Jack", "Victor", "Gautrekur", "Sandri", "Sigarr", "Arnbergur", "Hnikarr", "Viljar", "Lindar", "Gautvi\u00f0ur", "Unnsteinn", "H\u00e1lfdan", "\u00der\u00e1ndur", "Annas", "Salmann", "Kj\u00e1rr", "Mar\u00edn\u00f3", "S\u00e6vin", "Vestar", "Baldwin", "Fjalar", "Geirr\u00f6\u00f0ur", "R\u00f6skvi", "S\u00e6mann", "Hylur", "Laufar", "Angant\u00fdr", "Adam", "Bj\u00f3lfur", "Gr\u00edmar", "Svein\u00fe\u00f3r", "J\u00f3nbj\u00f6rn", "\u00d6gmundur", "Stanley", "J\u00f3ann", "M\u00ed\u00f3", "\u00deorgeir", "Andr\u00e9", "\u00dalfar", "S\u00e6laugur", "Sigurmann", "Stefan", "Baldur", "Svanlaugur", "Arnold", "Sigurhans", "Gl\u00famur", "Einar", "Sjafnar", "Liljar", "\u00c1stvaldur", "Ari", "Elent\u00ednus", "Geirar\u00f0ur", "Hildibergur", "Jafet", "Hlini", "Steinar", "Refur", "Heisi", "Jakob", "\u00dej\u00f3\u00f0mar", "Issi", "Matt\u00edas", "Kubbur", "\u00cdsarr", "Valmundur", "S\u00e6mundur", "Fri\u00f0laugur", "V\u00f6ggur", "El\u00edmar", "\u00c1stvar", "Reinhart", "Kn\u00fatur", "F\u00fasi", "Z\u00f3phan\u00edas", "\u00c1ri", "Bergur", "Sigj\u00f3n", "S\u00edmon", "Abraham", "Freybj\u00f6rn", "G\u00fdmir", "J\u00e1tmundur", "Sigur", "Petter", "Eragon", "N\u00e1ttm\u00f6r\u00f0ur", "J\u00f3i", "Vikar", "Lev\u00ed", "Almar", "Gr\u00edmur", "Hrannar", "Rey", "Karles", "Hemmert", "K\u00e1r", "Arnlj\u00f3tur", "Le\u00f3", "Huxley", "\u00de\u00f3rbj\u00f6rn", "\u00c1ki", "Gilmar", "Kristleifur", "R\u00f3lant", "Bet\u00fael", "H\u00e1var\u00f0ur", "Wilhelm", "Vilmundur", "\u00d3feigur", "Tjaldur", "Austmann", "Normann", "Bernhar\u00f0", "Hr\u00fatur", "Korri", "G\u00fastaf", "\u00dei\u00f0rik", "Ketill", "Ramses", "Ermenrekur", "Kolvi\u00f0ur", "J\u00fal\u00edus", "Au\u00f0unn", "G\u00f3i", "J\u00f3nsi", "R\u00f3sinkrans", "Esra", "Benjam\u00edn", "Hrafnkell", "Dagbjartur", "F\u00f3lki", "\u00dej\u00f3\u00f0\u00f3lfur", "Arnm\u00f3\u00f0ur", "Jason", "Reynald", "\u00deorberg", "\u00deorgn\u00fdr", "Hafsteinn", "N\u00f6kkvi", "\u00d6rlygur", "Veturli\u00f0i", "Herluf", "Jav\u00ed", "\u00c6sir", "Varmi", "Valgar\u00f0ur", "Anders", "Val\u00fe\u00f3r", "Dag\u00fe\u00f3r", "Liam", "Olli", "\u00c1s", "Fj\u00f3lmundur", "Eddi", "\u00der\u00f3ttur", "Sigurlaugur", "Sandur", "Valgeir", "S\u00e6vald", "Tobbi", "\u00dej\u00f3\u00f0leifur", "J\u00f3steinn", "Fritz", "Rag\u00fael", "Jarfi", "N\u00f3vember", "Vilbert", "Loftur", "Gu\u00f0\u00fe\u00f3r", "Mekkin\u00f3", "Bergmar", "Arnfreyr", "Patrekur", "Berghreinn", "Bl\u00e6ngur", "B\u00f6rkur", "Okt\u00f3", "\u00cdsleifur", "\u00c1sl\u00e1kur", "Valbergur", "Hafni", "Benon\u00fd", "Ingjaldur", "Kristj\u00e1n", "Arnbj\u00f6rn", "Finnbogi", "Kristj\u00f3n", "Bekan", "Sigur\u00f6rn", "Ernst", "H\u00e1mundur", "\u00c1slaugur", "Kristmar", "Bernhard", "Vigur", "Falgeir", "M\u00e1rus", "L\u00f3i", "Vilbj\u00f6rn", "Tindar", "Sig\u00fe\u00f3r", "Sturla", "Hei\u00f0mundur", "Bruno", "T\u00edmoteus", "Fj\u00f6lvar", "Elvin", "Aron", "Kraki", "Bassi", "H\u00e1leygur", "Hector", "Mikael", "Mummi", "Steinm\u00f3\u00f0ur", "Au\u00f0bj\u00f6rn", "Einir", "L\u00fater", "Eldar", "Kolbj\u00f6rn", "T\u00edmi", "Virgill", "\u00deyrnir", "V\u00e9mundur", "\u00deorbj\u00f6rn", "F\u00e1lki", "\u00d6lnir", "R\u00f6kkvi", "Pedr\u00f3", "Arnald", "Rannver", "Fri\u00f0\u00fe\u00f3r", "V\u00e1li", "Bl\u00e6var", "\u00c1rni", "\u00dalrik", "Gael", "Borg\u00falfur", "Adolf", "Morgan", "Vi\u00f0jar", "Hjaltal\u00edn", "Marzil\u00edus", "\u00c1skell", "Gunnbj\u00f6rn", "Hermann", "Flosi", "\u00deyrill", "Leiknir", "Eikar", "\u00de\u00f3rar", "Eldj\u00e1rn", "Hei\u00f0mar", "Gunnberg", "S\u00f3limann", "\u00c1si", "N\u00fami", "Leonard", "R\u00e1\u00f0geir", "Sigurl\u00e1s", "Sesil", "Jarpi", "Eysteinn", "\u00der\u00e1inn", "Gu\u00f0ni", "Magni", "Michael", "Gunnhallur", "B\u00e6ringur", "Brynsteinn", "Brynt\u00fdr", "Snj\u00f3lfur", "Birnir", "Jaki", "\u00dej\u00f3\u00f0ann", "Bjarki", "Egg\u00fe\u00f3r", "Kort", "Hugi", "G\u00edgjar", "Kaldi", "B\u00fai", "Freym\u00f3\u00f0ur", "\u00c1sgautur", "Gu\u00f0mon", "Finnlaugur", "Orvar", "\u00deorvar", "Friedrich", "Sigurp\u00e1ll", "Sigmann", "Edvin", "\u00cdmi", "Baltasar", "Frosti", "Lj\u00fafur", "Freygar\u00f0ur", "V\u00f6lundur", "Kristgeir", "\u00dej\u00f3st\u00f3lfur", "Gizur", "Hr\u00f3ar", "J\u00farek", "\u00d6nundur", "Runi", "Ell\u00eds", "Haki", "Au\u00f0berg", "H\u00f6\u00f0ur", "Sigfre\u00f0ur", "Ar\u00edel", "Vilhelm", "Daniel", "Ormur", "R\u00f3sant", "Hamar", "Mj\u00f6lnir", "Kris", "N\u00edls", "Eldur", "Andreas", "Engilj\u00f3n", "Ev\u00edan", "J\u00f3n\u00fe\u00f3r", "Kristvaldur", "Mar\u00edas", "R\u00f3si", "Fri\u00f0vin", "Kaspar", "Ey\u00fe\u00f3r", "H\u00f3seas", "Birkir", "Sigurj\u00f3n", "Hildar", "Siguroddur", "Sigurgestur", "Hrafn", "R\u00f3me\u00f3", "Ad\u00f3lf", "Sigurberg", "Gottsveinn", "S\u00e6berg", "Milli", "Baugur", "H\u00f3lmar", "\u00d6ssur", "J\u00f6kull", "Elin\u00f3r", "Enok", "H\u00f3lmgeir", "Ketilbj\u00f6rn", "Ernest", "\u00dej\u00e1lfi", "\u00dalft\u00fdr", "Varmar", "Hr\u00f3\u00f0mar", "Svanbj\u00f6rn", "Haraldur", "Frank", "J\u00f3vin", "Benv\u00fd", "Benedikt", "Gunnleifur", "Sigurbaldur", "Geir\u00f3lfur", "Br\u00edmi", "J\u00f3akim", "Valter", "Hr\u00f3bjartur", "Bergmann", "Duf\u00feakur", "Berti", "Marzell\u00edus", "Rikhar\u00f0ur", "Tandri", "Dyn\u00fe\u00f3r", "Valsteinn", "Jasper", "Dagfari", "Tolli", "Sn\u00e6ringur", "Dolli", "Bj\u00f6rgmundur", "S\u00e6i", "Brimi", "Kristofer", "L\u00f3ni", "Benidikt", "Bergj\u00f3n", "Hl\u00ed\u00f0ar", "Emil", "Aspar", "Kj\u00f3i", "Skr\u00f6ggur", "Randver", "Rikhar\u00f0", "Au\u00f0bergur", "Elberg", "Huginn", "Sigurbrandur", "J\u00f6rvar", "Ingimagn", "Thor", "\u00derymur", "Gn\u00fapur", "Fri\u00f0j\u00f3n", "Herbj\u00f6rn", "Vilbrandur", "Hallberg", "Sigursteinn", "Sigurn\u00fdas", "Martin", "Hallsteinn", "Gu\u00f0r\u00f6\u00f0ur", "Kristmundur", "Valent\u00edn", "\u00c1sar", "N\u00f3am", "Gu\u00f0bj\u00f6rn", "Pjetur", "Sigvar\u00f0ur", "Bertram", "Gunnd\u00f3r", "Sandel", "Mari", "A\u00f0albj\u00f6rn", "Hrappur", "Brandr", "Jan", "\u00c1lf\u00fe\u00f3r", "Rex", "Okt\u00f3v\u00edus", "Skj\u00f6ldur", "J\u00f3hann", "Gu\u00f0leifur", "Sigvaldi", "Svanberg", "Gaston", "Hei\u00f0rekur", "M\u00f3ses", "Alrekur", "Herleifur", "Ulrich", "S\u00e6var", "Bent", "Hersir", "Gu\u00f0bergur", "\u00de\u00f3rbergur", "Bjarg\u00fe\u00f3r", "Muggur", "Harry", "Diego", "Freyr", "Bjarnleifur", "William", "Hallfre\u00f0ur", "Spor\u00f0i", "Tob\u00edas", "Sverre", "H\u00e1rekur", "Arnes", "\u00d6rn", "Alex", "Hervar\u00f0ur", "Styrk\u00e1r", "Bjartur", "Sighvatur", "\u00deorgestur", "\u00deorbergur", "R\u00f3senberg", "Bjargmundur", "Mar\u00eds", "Elli", "Harr\u00fd", "\u00derymir", "J\u00f6rfi", "\u00cdvar", "Gu\u00f0geir", "\u00de\u00f3rormur", "Siglaugur", "\u00cdan", "Joshua", "\u00dej\u00f3star", "Skorri", "Man\u00fael", "Jes", "Henry", "Sigbert", "Hallgils", "Sigf\u00fas", "\u00dalfkell", "Elis", "Lambi", "Narfi", "Krist\u00fe\u00f3r", "\u00de\u00f3rinn", "S\u00f6ren", "Vatnar", "Gneisti", "St\u00f3r\u00f3lfur", "V\u00ed\u00f0ar", "Fj\u00f6rnir", "Margr\u00edmur", "Oddfreyr", "R\u00ed\u00f3", "Gu\u00f0finnur", "Valbrandur", "Fannberg", "Gretar", "Reimar", "Forni", "Svanmundur", "Lambert", "Sigr\u00edkur", "\u00deormundur", "Hallgr\u00edmur", "Dam\u00eden", "Anes", "Austar", "Sigurhj\u00f6rtur", "Vernhar\u00f0", "Salmar", "\u00cdseldur", "Hjarnar", "Hl\u00f6\u00f0ur", "Hug\u00f3", "Sebastian", "\u00c1rs\u00e6ll", "Geir\u00fej\u00f3fur", "Hans", "Hilmir", "T\u00f3ki", "Margeir", "Jesper", "Uggi", "Agni", "V\u00edgsteinn", "V\u00e9bj\u00f6rn", "Toddi", "Klemens", "Adrian", "Ar\u00edus", "Eyvar", "\u00dalfgeir", "Arinbj\u00f6rn", "Trausti", "Fri\u00f0bergur", "Kalmar", "Den\u00edel", "Sigd\u00f3r", "Haf\u00fe\u00f3r", "Starka\u00f0ur", "Anton", "\u00de\u00f3r\u00f0ur", "Arthur", "Lo\u00f0mundur", "Bjarmi", "Gu\u00f0brandur", "\u00c1lfgeir", "Albert", "Gj\u00faki", "Tryggvi", "Geirfinnur", "H\u00e1kon", "Birtingur", "Stein\u00f3lfur", "\u00c1lfgr\u00edmur", "\u00d3ttar", "Sveinbjartur", "A\u00f0alberg", "Kvasir", "Sn\u00e6varr", "T\u00fdr", "Merk\u00far", "Atli", "Styrmir", "Erpur", "L\u00fdtingur", "Mosi", "J\u00f3nmundur", "Mj\u00f6llnir", "Fri\u00f0r\u00edkur", "T\u00f3ti", "Hei\u00f0arr", "Eykam", "Gu\u00f0mar", "Dufgus", "N\u00edels", "Melrakki", "Hj\u00e1lmt\u00fdr", "Vorm", "A\u00f0algeir", "Ar\u00edan", "H\u00e6nir", "Viktor", "Elvis", "Sophus", "\u00d6lvir", "Kristbergur", "Maggi", "\u00de\u00f3rmundur", "\u00de\u00f3rlaugur", "R\u00f3smundur", "Arnmundur", "Vignir", "Siggeir", "Engill", "Eldon", "Rikki", "Alli", "Gunn\u00f3li", "Karvel", "Tindur", "Sigurvaldi", "Geirleifur", "Geri", "Amil", "Hymir", "Laugi", "\u00c1stvald", "Lei\u00f0\u00f3lfur", "\u00de\u00f3ri", "A\u00f0alsteinn", "Vald\u00f3r", "S\u00fdrus", "Vili", "Heinrekur", "Gunnr\u00f6\u00f0ur", "G\u00edgur", "Hergils", "Styrr", "Ingi", "Beinteinn", "L\u00father", "Elmar", "Arnsteinn", "Skapti", "R\u00fabar", "\u00dej\u00f3\u00f0var\u00f0ur", "A\u00f0albergur", "T\u00f3r", "V\u00edglundur", "Freysteinn", "Harald", "Kjartan", "Moli", "Jamil", "Kn\u00f6rr", "Ebeneser", "Birgir", "T\u00edbor", "Hallbj\u00f6rn", "Hannibal", "Sigurbergur", "\u00c6var", "Olaf", "Sn\u00e6bj\u00f6rn", "Finngeir", "Valdi", "Valent\u00ednus", "Bylur", "Sv\u00f6rfu\u00f0ur", "Gr\u00edm\u00f3lfur", "L\u00edni", "H\u00e6ngur", "Hl\u00f6\u00f0ver", "\u00c1rel\u00edus", "Nathan", "\u00c1stbj\u00f6rn", "Finnvar\u00f0ur", "Gu\u00f0var\u00f0ur", "M\u00edmir", "\u00d6gri", "S\u00f3l\u00falfur", "Da\u00f0i", "Gu\u00f0veigur", "Hildimundur", "Vilhj\u00e1lmur", "V\u00edgmundur", "Arngeir", "Geirlaugur", "H\u00fann", "\u00d6rvar", "Gunnvaldur", "Hrafnt\u00fdr", "\u00c1rgeir", "Hildimar", "\u00c1stmundur", "Unnbj\u00f6rn", "Klemenz", "Mortan", "A\u00f0almundur", "\u00c1rmann", "Fri\u00f0mann", "Bentley", "Bergmundur", "Anfinn", "Otti", "Ner\u00f3", "H\u00fami", "Krist\u00f3", "Bryn\u00fe\u00f3r", "Kristens", "Brynleifur", "\u00deorleikur", "Hr\u00f3\u00f0\u00f3lfur", "Thomas", "Unnar", "Hei\u00f0berg", "Gregor", "\u00c1smundur", "Andr\u00e9s", "D\u00fdri", "L\u00f3rens", "Gu\u00f0bjartur", "Hrei\u00f0ar", "Eymundur", "\u00d3svaldur", "G\u00edsli", "Hafli\u00f0i", "Makan", "\u00c1sr\u00f6\u00f0ur", "Jonni", "Sv\u00f6lnir", "Kristfinnur", "Zophan\u00edas", "Hnefill", "El\u00edas", "R\u00f6gnvald", "Arnar", "Hallkell", "Math\u00edas", "Lindberg", "Hj\u00f6rleifur", "Ant\u00f3n\u00edus", "Arnfinnur", "Francis", "Otur", "Seifur", "Sigbj\u00f6rn", "Alfred", "Kristinn", "N\u00e1tt\u00falfur", "Vilji", "\u00de\u00f3rgn\u00fdr", "\u00d6xar", "Au\u00f0ur", "G\u00fastav", "Fertram", "\u00de\u00f3r\u00f3lfur", "Sigurleifur", "Berent", "Baddi", "Freymann", "Gumi", "S\u00f3lberg", "Vopni", "Axel", "E\u00f0vald", "\u00dalfh\u00e9\u00f0inn", "Oktav\u00edus", "Stormur", "D\u00f3naldur", "Au\u00f0mundur", "Reinhard", "El\u00eda", "Fri\u00f0bert", "Arnaldur", "Steinn", "Bambus", "Mildinberg", "S\u00f3lvin", "\u00de\u00f3rgr\u00edmur", "Svanbergur", "Val\u00edant", "Ur\u00f0ar", "F\u00edus", "Olivert", "Bjarn\u00fe\u00f3r", "Kiljan", "Odd\u00fe\u00f3r", "Hreggvi\u00f0ur", "Torfi", "Alan", "Mikj\u00e1ll", "Muninn", "Geirhj\u00f6rtur", "Oddgeir", "Nicolas", "Herm\u00f3\u00f0ur", "R\u00f3sberg", "Henr\u00fd", "Elli\u00f0i", "B\u00e6ron", "Hj\u00f6rt\u00fe\u00f3r", "Ingimar", "\u00cdsrael", "Yrkill", "K\u00edran", "\u00deorgr\u00edmur", "D\u00f3nald", "Erlingur", "Patrek", "Fj\u00f3lar", "Svan", "H\u00e9\u00f0inn", "Nikolai", "Svend", "D\u00f3r", "Gunn\u00fe\u00f3r", "Ubbi", "Hei\u00f0lindur", "Gaui", "Reidar", "Svavar", "Hei\u00f0bert", "Kusi", "\u00d3svald", "Einvar\u00f0ur", "Fri\u00f0bj\u00f6rn", "S\u00f3f\u00f3n\u00edas", "Leifur", "Natanael", "Hartvig", "Dominik", "Hergill", "Au\u00f0\u00f3lfur", "Gellir", "Valt\u00fdr", "\u00c1sbergur", "T\u00f3mas", "Hildi\u00fe\u00f3r", "Rafnar", "Oddsteinn", "Pr\u00edor", "Sverrir", "Yngvi", "\u00deorvaldur", "Huldar", "Bryngeir", "Lev\u00fd", "Garibaldi", "Geirtryggur", "M\u00e1r", "Vestmar", "Hallgeir", "V\u00e9laugur", "Tr\u00famann", "\u00de\u00f3r\u00f6rn", "Konstant\u00ednus", "H\u00f3lm", "J\u00f3natan", "\u00d3lafur", "Fr\u00f3\u00f0mar", "Samson", "Saf\u00edr", "El\u00edeser", "Ingiberg", "Hrei\u00f0mar", "Brynj\u00f3lfur", "P\u00e1lmar", "Beitir", "\u00de\u00f3rlindur", "Ing\u00fe\u00f3r", "L\u00e9r", "S\u00e6bj\u00f6rn", "Gn\u00fdr", "Kristian", "D\u00f3ri", "D\u00f3mald", "J\u00fal\u00ed", "R\u00f3smann", "Sigurlinni", "Gu\u00f0fre\u00f0ur", "Annarr", "\u00d3li", "Eros", "Sn\u00e6\u00fe\u00f3r", "Leonhard", "Di\u00f0rik", "Burkni", "Anor", "Mark\u00f3", "Hilmar", "Rafnkell", "Styrbj\u00f6rn", "Flemming", "Fanngeir", "Bjarkar", "\u00d3nar", "Hartmann", "R\u00f3sinkar", "Bj\u00f6rgvin", "Finnbj\u00f6rn", "Kolskeggur", "A\u00f0alborgar", "Rudolf", "Korm\u00e1kur", "Bl\u00e6r", "Jarl", "\u00c1lfar", "\u00de\u00f3rhallur", "J\u00e1rngr\u00edmur", "Baldvin", "J\u00f3safat", "Skr\u00fdmir", "Elfr\u00e1\u00f0ur", "H\u00fanbogi", "\u00c1lfur", "Nils", "Herfinnur", "Embrek", "Mar\u00edus", "Mikki", "V\u00e9steinn", "Veigar", "Birtir", "Geimar", "Bjarnh\u00e9\u00f0inn", "Muggi", "Ver\u00f3na", "Ingivaldur", "Heimir", "Styr", "Dav\u00ed\u00f0", "S\u00edrnir", "Frans", "Hr\u00f3lfur", "Elimar", "Zakar\u00eda", "Neisti", "Bj\u00f6rg\u00falfur", "Karel", "M\u00edr", "Hermundur", "Nikul\u00e1s", "Olav", "Vermundur", "Hervar", "Krister", "Haukvaldur", "Sigt\u00fdr", "Magngeir", "Greipur", "Valgar\u00f0", "R\u00e1\u00f0var\u00f0ur", "Nenni", "Sigurd\u00f3r", "S\u00edvar", "Ingberg", "Amor", "G\u00fdgjar", "M\u00f6r\u00f0ur", "\u00deorfinnur", "S\u00e6\u00fe\u00f3r", "Hj\u00e1lm\u00fe\u00f3r", "H\u00fabert", "\u00de\u00f3rbjarni", "Geirhar\u00f0ur", "Hagbar\u00f0ur", "Eyleifur", "L\u00e1rent\u00edus", "Indri\u00f0i", "Felix", "Seimur", "Hildibrandur", "Bar\u00f0i", "E\u00f0var\u00f0", "\u00c1sd\u00f3r", "Berg\u00fe\u00f3r", "F\u00e1fnir", "Ormar", "Ingvi", "Ingimundur", "Ronald", "Gissur", "Sveinlaugur", "Bjarni", "L\u00fd\u00f0ur", "Met\u00fasalem", "Finnur", "Gustav", "Run\u00f3lfur", "Hei\u00f0ar", "St\u00edgur", "Arngils", "J\u00e1tvar\u00f0ur", "N\u00fdvar\u00f0", "Bo\u00f0i", "Sveinungi", "Steingr\u00edmur", "Sm\u00e1ri", "Kamal", "Bjarnar", "Silli", "S\u00f3lbjartur", "Bambi", "Bjarnfre\u00f0ur", "Jerem\u00edas", "Kaleb", "Dal\u00ed", "Kolur", "\u00dei\u00f0randi", "L\u00ednberg", "S\u00f3f\u00fas", "El\u00ednbergur", "\u00d3l\u00edver", "Il\u00edas", "Georg", "Sigurn\u00fdjas", "Ernir", "T\u00edm\u00f3teus", "Steinberg", "Gamal\u00edel", "Sakar\u00edas", "Sal\u00f3mon", "\u00d6rn\u00f3lfur", "Eymar", "Hr\u00f3i", "\u00deengill", "\u00deinur", "Thorsteinn", "Sn\u00e6bjartur", "Fr\u00e1nn", "Siggi", "Werner", "Eld\u00f3r", "Hr\u00f3\u00f0geir", "Kristd\u00f3r", "Annmar", "John", "Sturlaugur", "H\u00f3lmsteinn", "Rolf", "Eil\u00edfur", "Abel", "Kl\u00e6ngur", "Hafgr\u00edmur", "Hallvar\u00f0ur", "H\u00f3lmbert", "Magn\u00fas", "Borgar", "Julian", "Herlaugur", "Alex\u00edus", "P\u00e9tur", "Arngr\u00edmur", "\u00der\u00fa\u00f0mar", "Ferd\u00ednand", "Maximus", "\u00d3ttarr", "Sigurlogi", "Hjalti", "Erlar", "Svali", "D\u00f3maldur", "L\u00ed\u00f3", "Fl\u00f3ki", "Lyng\u00fe\u00f3r", "Sigurgr\u00edmur", "Hei\u00f0bjartur", "Gunngeir", "Otkell", "Hl\u00e9r", "Melk\u00f3lmur", "Sigfastur", "Melk\u00edor", "Hl\u00edfar", "Ben\u00f3n\u00ed", "Janus", "Sigtryggur", "Estefan", "N\u00f3ri", "Dan", "Danival", "Gr\u00edmnir", "Agnar", "S\u00f3lmundur", "Bern\u00f3dus", "Fj\u00f6lnir", "Sigurmar", "Arnlaugur", "Brimir", "Hildir", "Eberg", "Alvar", "Vi\u00f0ar", "Tonni", "Sigurbjartur", "Dalvin", "\u00deorri", "Sigbjartur", "Gyr\u00f0ir", "R\u00f3sar", "Hersteinn", "S\u00f3lbj\u00f6rn", "Hr\u00f3\u00f0var", "Hektor", "Hj\u00e1lmar", "Arn\u00falfur", "S\u00e6r", "Stirnir", "El\u00eds", "Steinr\u00f6\u00f0ur", "Marlon", "Esjar", "Finn", "J\u00f3nas", "Mark\u00fe\u00f3r", "Franz", "Walter", "V\u00edfill", "Sophan\u00edas", "Snorri", "Rafn", "Hjalmar", "Dan\u00edel", "Marthen", "Kali", "Hraunar", "H\u00e1var", "Fri\u00f0geir", "D\u00fai", "\u00cdsak", "Diljar", "Gr\u00edmkell", "Gu\u00f0vin", "L\u00fa\u00f0v\u00edg", "Johan", "Sveinmar", "Ugluspegill", "Finnj\u00f3n", "A\u00f0alr\u00e1\u00f0ur", "Bjarmar", "R\u00fatur", "Frankl\u00edn", "Leonard\u00f3", "Ymir", "Go\u00f0mundur", "Uni", "Meyvant", "J\u00f3nd\u00f3r", "Sk\u00edrnir", "Le\u00f3pold", "\u00c1str\u00e1\u00f0ur", "R\u00f6ggi", "Kristlaugur", "Aldar", "Skarph\u00e9\u00f0inn", "\u00de\u00f3roddur", "Steinarr", "Hjallk\u00e1r", "Ingi\u00fe\u00f3r", "Uxi", "Sveinj\u00f3n", "Gu\u00f0j\u00f3n", "J\u00f3n", "Erik", "\u00d3\u00f0inn", "Sigmar", "\u00de\u00f3rleifur", "C\u00e6sar", "Ste\u00f0ji", "Hallmundur", "Hl\u00f6\u00f0mundur", "H\u00f3lmfastur", "Herbert", "Heikir", "Gu\u00f0mann", "Fenrir", "\u00d3liver", "Keran", "\u00dej\u00f3\u00f0bj\u00f6rn", "Asael", "Gautur", "Manfred", "B\u00e1r\u00f0ur", "Marij\u00f3n", "Elfar", "Geisli", "\u00d6rlaugur", "\u00dalflj\u00f3tur", "Sigbergur", "L\u00fa\u00f0v\u00edk", "Dagur", "Annes", "Magn\u00fe\u00f3r", "R\u00f3sinberg", "Ares", "Reynar", "Kristbj\u00f6rn", "R\u00farik", "Gu\u00f0bjarni", "Sigurmon", "El\u00ednmundur", "Veigur", "Sigsteinn", "Stein\u00fe\u00f3r", "Garri", "Tj\u00f6rvi", "A\u00f0\u00f3lf", "Damjan", "R\u00edkhar\u00f0ur", "Valbj\u00f6rn", "Gr\u00edmlaugur", "Ferdinand", "Gerald", "Antonio", "Bast\u00edan", "Marel", "Eman\u00fael", "Edilon", "Br\u00edmir", "Kinan", "Fl\u00f3rent", "Vigg\u00f3", "Gar\u00f0ar"], "Counterpart": "e3c38f5e-794b-4b33-a3f9-3de70d489335", "StateId": "4c501f5a-efb2-4e48-ad17-31dbdea45bde", "Email": "sindrigudmundsson@gmail.com"});
    });
  }
  try {
    const response = await apiClient.get<NamesResponse>(`/state/${id}`);
    return response.data;
  } catch (err) {
    if (err && err.response) {
      return err.response.data;
    }
    throw err;
  }
}

export const selectNames = async (id: string, select: Array<string>, reject: Array<string>): Promise<NamesResponse> => {
  try {
    const response = await apiClient.post<NamesResponse>(`/state/${id}`, {select, reject});
    return response.data;
  } catch (err) {
    if (err && err.response) {
      return err.response.data;
    }
    throw err;
  }
}

export const createState = async (email1: string, email2: string, sex: string): Promise<CreateStateResponse> => {
  try {
    const response = await apiClient.put<CreateStateResponse>(`/state/`, {email1, email2, sex});
    return response.data;
  } catch (err) {
    if (err && err.response) {
      return err.response.data;
    }
    throw err;
  }
}

