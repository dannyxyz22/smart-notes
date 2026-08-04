/**
 * Calendário offline do Santo do Dia.
 * Fonte editorial: Vatican News (https://www.vaticannews.va/pt/santo-do-dia.html)
 * Última revisão: 2026-08-04
 *
 * Atualize com `npm run saints:update` e valide com
 * `npm run saints:validate` antes de publicar uma nova versão.
 */

export interface SaintOfDayRecord {
  readonly name: string;
  readonly sourceUrl: string;
}

export const SAINTS_BY_DATE: Readonly<Record<string, SaintOfDayRecord>> = Object.freeze(
{
  "01-01": {
    "name": "S. Vicente Maria Strámbi, bispo passionista",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/01.html"
  },
  "01-02": {
    "name": "SS. Basílio Magno e Gregório Nazianzeno, bispos e doutores da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/02/ss--basilio-magno-e-gregorio-nazianzeno--bispos-e-doutores-da-ig.html"
  },
  "01-03": {
    "name": "S. Antero, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/03.html"
  },
  "01-04": {
    "name": "S. Ângela de Folinho, religiosa franciscana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/04/s--angela-de-folinho--religiosa-franciscana.html"
  },
  "01-05": {
    "name": "S. Eduardo, rei da Inglaterra",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/05.html"
  },
  "01-06": {
    "name": "S. Carlos de Sezze, religioso franciscano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/06.html"
  },
  "01-07": {
    "name": "S. Raimundo de Penhaforte, presbítero dominicano, co-fundador dos Mercedários",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/07/s--raimundo-de-penhaforte--presbitero-dominicano--co-fundador-do.html"
  },
  "01-08": {
    "name": "S. Severino, abade, apóstolo de Nórico",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/08.html"
  },
  "01-09": {
    "name": "B. Antônio Fatati, bispo de Ancona",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/09.html"
  },
  "01-10": {
    "name": "S. Agatão, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/10.html"
  },
  "01-11": {
    "name": "S. Higino, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/11.html"
  },
  "01-12": {
    "name": "S. Arcádio, mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/12.html"
  },
  "01-13": {
    "name": "S. Hilário, bispo de Poitiers e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/13/s--hilario--bispo-de-poitiers-e-doutor-da-igreja.html"
  },
  "01-14": {
    "name": "S. Félix de Nola, presbítero",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/14.html"
  },
  "01-15": {
    "name": "S. Paulo, primeiro eremita",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/15.html"
  },
  "01-16": {
    "name": "S. Marcelo I, papa e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/16.html"
  },
  "01-17": {
    "name": "S. Antão, abade",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/17/s--antao--abade.html"
  },
  "01-18": {
    "name": "S. Prisca, fundadora da igreja homônima no Aventino",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/18.html"
  },
  "01-19": {
    "name": "S. Germânico, mártir de Filadélfia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/19.html"
  },
  "01-20": {
    "name": "S. Fabiano, papa e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/20.html"
  },
  "01-21": {
    "name": "S. Inês, virgem e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/21/s--ines--virgem-e-martir.html"
  },
  "01-22": {
    "name": "S. Vicente, diácono espanhol e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/22.html"
  },
  "01-23": {
    "name": "S. Emerenciana, mártir romana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/23.html"
  },
  "01-24": {
    "name": "S. Francisco de Sales, bispo de Genebra, doutor da Igreja, fundador da Ordem da Visitação, padroeiro da imprensa católica",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/24/s--francisco-de-sales--bispo-de-genebra--doutor-da-igreja--funda.html"
  },
  "01-25": {
    "name": "S. Ananias, que batizou o Apóstolo em Damasco",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/25.html"
  },
  "01-26": {
    "name": "SS. Timóteo e Tito, bispos, discípulos de S. Paulo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/26/ss--timoteo-e-tito--bispos--discipulos-de-s--paulo.html"
  },
  "01-27": {
    "name": "S. Ângela Mérici, virgem, fundadora das Ursulinas",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/27/s--angela-merici--virgem--fundadora-das-ursulinas.html"
  },
  "01-28": {
    "name": "S. Tomás de Aquino, presbítero dominicano, doutor de Igreja, padroeiro das escolas católicas",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/28/s--tomas-de-aquino--presbitero-dominicano--doutor-de-igreja--pad.html"
  },
  "01-29": {
    "name": "S. Constâncio, bispo de Perúgia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/29.html"
  },
  "01-30": {
    "name": "S. Martinha, mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/30.html"
  },
  "01-31": {
    "name": "S. João Bosco, presbítero, fundador dos Salesianos, pai e mestre dos jovens",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/01/31/s--joao-bosco--presbitero--fundador-dos-salesianos--pai-e-mestre.html"
  },
  "02-01": {
    "name": "B. Ludovica Albertoni, viúva romana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/01/b--ludovica-albertoni--viuva-romana.html"
  },
  "02-02": {
    "name": "S. Catarina de Ricci, virgem dominicana de Prato na Itália",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/02.html"
  },
  "02-03": {
    "name": "S. Brás, bispo de Sebaste e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/03/s--bras--bispo-de-sebaste-e-martir.html"
  },
  "02-04": {
    "name": "S. José de Leonessa, presbítero, capuchinho",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/04.html"
  },
  "02-05": {
    "name": "S. Águeda, virgem e mártir de Catânia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/05/s--agueda--virgem-e-martir-de-catania.html"
  },
  "02-06": {
    "name": "SS. Paulo Miki presbítero e Companheiros, mártires japoneses",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/06/ss--paulo-miki-presbitero-e-companheiros--martires-japoneses.html"
  },
  "02-07": {
    "name": "S. Ricardo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/07.html"
  },
  "02-08": {
    "name": "S. Jerônimo Emiliano, fundador dos Somascos, padroeiro dos órfãos e da juventude abandonada",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/08/s--jeronimo-emiliano--fundador-dos-somascos--padroeiro-dos-orfao.html"
  },
  "02-09": {
    "name": "S. Apolônia, virgem e mártir de Alexandria no Egipto",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/09.html"
  },
  "02-10": {
    "name": "S. Escolástica virgem, irmã de S. Bento",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/10/s--escolastica-virgem--irma-de-s--bento.html"
  },
  "02-11": {
    "name": "Nossa Senhora de Lourdes",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/11/nossa-senhora-de-lourdes.html"
  },
  "02-12": {
    "name": "SS. Saturnino e Companheiros, mártires de Abissínia, África",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/12.html"
  },
  "02-13": {
    "name": "B. Jordão da Saxônia, presbítero dominicano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/13/b--jordao-da-saxonia--presbitero-dominicano.html"
  },
  "02-14": {
    "name": "SS. Cirilo, monge e Metódio, bispo - PADROEIROS DA EUROPA",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/14/ss--cirilo--monge-e-metodio--bispo---padroeiros-da-europa-.html"
  },
  "02-15": {
    "name": "S. Onésimo, discípulo de S. Paulo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/15.html"
  },
  "02-16": {
    "name": "S. Juliana, virgem e mártir de Nicomedia, na Campânia, Itália",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/16.html"
  },
  "02-17": {
    "name": "SS. Sete Fundadores da Ordem dos Servitas de Nossa Senhora, entre os quais S. Aleixo Falconieri",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/17/ss--sete-fundadores-da-ordem-dos-servitas-de-nossa-senhora--entr.html"
  },
  "02-18": {
    "name": "B. João de Fiesole (Fra Angélico), sacerdote dominicano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/18/b--joao-de-fiesole--fra-angelico---sacerdote-dominicano.html"
  },
  "02-19": {
    "name": "S. Conrado Confalonieri, eremita franciscano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/19.html"
  },
  "02-20": {
    "name": "S. Leão de Catânia, bispo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/20.html"
  },
  "02-21": {
    "name": "S. Pedro Damião, bispo de Óstia e cardeal, doutor da Igreja, camaldolense",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/21/s--pedro-damiao--bispo-de-ostia-e-cardeal--doutor-da-igreja--cam.html"
  },
  "02-22": {
    "name": "S. Maximiano de Ravena, bispo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/22.html"
  },
  "02-23": {
    "name": "S. Policarpo, bispo de Esmirna e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/23/s--policarpo--bispo-de-esmirna-e-martir.html"
  },
  "02-24": {
    "name": "SS. Evécio e Pedro, mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/24.html"
  },
  "02-25": {
    "name": "S. Nestor, bispo de Magido e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/25.html"
  },
  "02-26": {
    "name": "S. Faustiniano, bispo de Bolonha",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/26.html"
  },
  "02-27": {
    "name": "S. Gabriel de Nossa Senhora das Dores, clérigo passionista",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/27/s--gabriel-de-nossa-senhora-das-dores--clerigo-passionista.html"
  },
  "02-28": {
    "name": "S. Romão, abade",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/28.html"
  },
  "02-29": {
    "name": "Santo Augusto Chapdelaine, mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/02/29.html"
  },
  "03-01": {
    "name": "S. Félix III, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/01.html"
  },
  "03-02": {
    "name": "S. Ângela da Cruz, virgem",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/02.html"
  },
  "03-03": {
    "name": "S. Cunegunda, esposa de S. Henrique II, imperador",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/03/s--cunegundes--esposa-de-s--henrique-ii--imperador.html"
  },
  "03-04": {
    "name": "S. Casimiro, padroeiro da Lituânia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/04.html"
  },
  "03-05": {
    "name": "S. Lúcio I, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/05.html"
  },
  "03-06": {
    "name": "S. Rosa de Viterbo, virgem franciscana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/06/s--rosa-de-viterbo--virgem-franciscana.html"
  },
  "03-07": {
    "name": "SS. Perpétua e Felicidade, mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/07.html"
  },
  "03-08": {
    "name": "S. João de Deus, fundador da Ordem Hospitaleira, padroeiro dos doentes, enfermeiros e hospitais",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/08/s--joao-de-deus--fundador-da-ordem-hospitaleira--padroeiro-dos-d.html"
  },
  "03-09": {
    "name": "S. Francisca romana, fundadora das Oblatas de Tor de’ Specchi",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/09/s--francisca-romana--fundadora-das-oblatas-de-tor-de-specchi.html"
  },
  "03-10": {
    "name": "S. Simplício, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/10.html"
  },
  "03-11": {
    "name": "S. Sofrônio, bispo de Jerusalém",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/11.html"
  },
  "03-12": {
    "name": "S. Maximiliano, mártir na África",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/12.html"
  },
  "03-13": {
    "name": "S. Sabino, mártir no Egito",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/13.html"
  },
  "03-14": {
    "name": "S. Matilde, rainha",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/14/s--matilde--rainha.html"
  },
  "03-15": {
    "name": "S. Clemente M. Hofbauer, presbítero redentorista",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/15.html"
  },
  "03-16": {
    "name": "SS. Hilário e Taciano, mártires de Aquileia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/16.html"
  },
  "03-17": {
    "name": "S. Patrício bispo, apóstolo da Irlanda",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/17/s--patricio-bispo--apostolo-da-irlanda.html"
  },
  "03-18": {
    "name": "S. Cirilo, bispo de Jerusalém e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/18/s--cirilo--bispo-de-jerusalem-e-doutor-da-igreja-.html"
  },
  "03-19": {
    "name": "S. José, Esposo Da Santíssima Virgem Maria, Padroeiro da Igreja Universal",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/19/s--jose--esposo-da-santissima-virgem-maria--padroeiro-da-igreja-.html"
  },
  "03-20": {
    "name": "S. João Nepomuceno, presbítero e mártir de Praga",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/20/s--joao-nepomuceno--presbitero-e-martir-de-praga.html"
  },
  "03-21": {
    "name": "S. Nicolau de Flüe, padroeiro da Suíça",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/21/s--nicolau-de-fluee--padroeiro-da-suica.html"
  },
  "03-22": {
    "name": "S. Paulo, bispo de Narbonne e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/22.html"
  },
  "03-23": {
    "name": "S. Turíbio de Mogrovejo, bispo de Lima",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/23/s--turibio-de-mogrovejo--bispo-de-lima.html"
  },
  "03-24": {
    "name": "Santo Óscar Romero, mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/24/santo-oscar-romero--martir.html"
  },
  "03-25": {
    "name": "S. Bom Ladrão",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/25.html"
  },
  "03-26": {
    "name": "S. Cástulo, mártir, na via Labicana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/26.html"
  },
  "03-27": {
    "name": "S. Ruperto, bispo de Salzburgo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/27.html"
  },
  "03-28": {
    "name": "S. Castor, mártir de Tarso",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/28.html"
  },
  "03-29": {
    "name": "S. Eustásio, bispo de Nápoles",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/29.html"
  },
  "03-30": {
    "name": "S. João Clímaco, abade no Monte Sinai",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/30/s--joao-climaco--abade-no-monte-sinai.html"
  },
  "03-31": {
    "name": "S. Balbina, matrona romana, fundadora da igreja homônima",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/03/31.html"
  },
  "04-01": {
    "name": "S. Venâncio, bispo de Salona na Dalmácia e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/01.html"
  },
  "04-02": {
    "name": "S. Francisco de Paula, eremita fundador da Ordem dos Mínimos",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/02/s--francisco-de-paula--eremita-fundador-da-ordem-dos-minimos-.html"
  },
  "04-03": {
    "name": "S. Sisto I, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/03/s--sisto-i--papa.html"
  },
  "04-04": {
    "name": "S. Isidoro, bispo de Sevilha e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/04/s--isidoro--bispo-de-sevilha-e-doutor-da-igreja-.html"
  },
  "04-05": {
    "name": "S. Vicente Ferrer, presbítero dominicano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/05/s--vicente-ferrer--presbitero-dominicano.html"
  },
  "04-06": {
    "name": "S. Gala, viúva romana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/06/s--gala--viuva-romana.html"
  },
  "04-07": {
    "name": "S. João Batista de la Salle, presbítero, fundador dos Irmãos das Escolas Cristãs",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/07/s--joao-batista-de-la-salle--presbitero--fundador-dos-irmaos-das.html"
  },
  "04-08": {
    "name": "S. Dionísio, bispo de Corinto",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/08.html"
  },
  "04-09": {
    "name": "S. Libório, bispo de Le Mans",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/09.html"
  },
  "04-10": {
    "name": "S. Madalena de Canossa, virgem, fundadora das Filhas e dos Filhos da Caridade",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/10/s--madalena-de-canossa--virgem--fundadora-das-filhas-e-dos-filho.html"
  },
  "04-11": {
    "name": "S. Estanislau, bispo de Cracóvia e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/11/s--estanislau--bispo-de-cracovia-e-martir.html"
  },
  "04-12": {
    "name": "S. Júlio I, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/12.html"
  },
  "04-13": {
    "name": "S. Hermenegildo, mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/13.html"
  },
  "04-14": {
    "name": "SS. Tibúrcio, Valeriano e Máximo, mártires, na via Ápia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/14/ss--tiburcio--valeriano-e-maximo--martires--na-via-apia.html"
  },
  "04-15": {
    "name": "S. Abúndio, mansionário vaticano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/15.html"
  },
  "04-16": {
    "name": "S. Bento José Labre",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/16.html"
  },
  "04-17": {
    "name": "S. Roberto, abade de Cìteaux",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/17.html"
  },
  "04-18": {
    "name": "S. Galdino, arcebispo de Milão e cardeal",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/18.html"
  },
  "04-19": {
    "name": "S. Leão IX, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/19/s--leao-ix--papa.html"
  },
  "04-20": {
    "name": "S. Aniceto, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/20.html"
  },
  "04-21": {
    "name": "S. Anselmo, arcebispo de Cantuária e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/21/s--anselmo--arcebispo-de-cantuaria-e-doutor-da-igreja.html"
  },
  "04-22": {
    "name": "S. Sotero, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/22.html"
  },
  "04-23": {
    "name": "S. Jorge mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/23/s--jorge-martir.html"
  },
  "04-24": {
    "name": "S. Fiel de Sigmaringa, sacerdote mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/24/s--fiel-de-sigmaringa--sacerdote-martir.html"
  },
  "04-25": {
    "name": "S. Marcos, Evangelista",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/25/s--marcos--evangelista.html"
  },
  "04-26": {
    "name": "S. Cleto, papa e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/26.html"
  },
  "04-27": {
    "name": "S. Simeão, bispo de Jerusalém e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/27/s--simeao--bispo-de-jerusalem-e-martir-.html"
  },
  "04-28": {
    "name": "S. Pedro Chanel, sacerdote e mártir da Oceania",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/28/s--pedro-chanel--sacerdote-e-martir-da-oceania.html"
  },
  "04-29": {
    "name": "S. Catarina de Sena, virgem, doutora da Igreja, Padroeira da Europa e da Itália",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/29/s--catarina-de-sena--virgem--doutora-da-igreja--padroeira-da-eur.html"
  },
  "04-30": {
    "name": "S. Pio V, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/04/30/s--pio-v--papa.html"
  },
  "05-01": {
    "name": "S. José operário, esposo da Santíssima Virgem Maria, protetor dos trabalhadores",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/01/s--jose-operario--esposo-da-santissima-virgem-maria--protetor-do.html"
  },
  "05-02": {
    "name": "S. Atanásio, bispo de Alexandria no Egito e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/02.html"
  },
  "05-03": {
    "name": "SS. Filipe e Tiago o Menor, apóstolos",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/03/ss--filipe-e-tiago-o-menor--apostolos.html"
  },
  "05-04": {
    "name": "S. Antonina, mártir de Niceia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/04.html"
  },
  "05-05": {
    "name": "S. Núncio Sulprício, jovem operário de Nápoles",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/05/s--nuncio-sulpricio--jovem-operario-de-napoles.html"
  },
  "05-06": {
    "name": "SS. Mariano e Tiago mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/06.html"
  },
  "05-07": {
    "name": "S. Flávia Domitila, mártir romana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/07.html"
  },
  "05-08": {
    "name": "S. Vítor, mártir de Milão",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/08/s--vitor--martir-de-milao.html"
  },
  "05-09": {
    "name": "S. Pacómio, abade",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/09.html"
  },
  "05-10": {
    "name": "S. Gordiano, mártir, na via Latina",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/10.html"
  },
  "05-11": {
    "name": "S. Antimo, mártir, na via Salária",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/11.html"
  },
  "05-12": {
    "name": "SS. Nereu e Aquileu, mártires, na via Ardeatina",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/12/ss--nereu-e-aquileu--martires--na-via-ardeatina.html"
  },
  "05-13": {
    "name": "Nossa Senhora de Fátima",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/13/nossa-senhora-de-fatima.html"
  },
  "05-14": {
    "name": "S. Matias, apóstolo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/14.html"
  },
  "05-15": {
    "name": "S. Torquato, bispo de Guádix",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/15.html"
  },
  "05-16": {
    "name": "S. Alexandre, bispo de Jerusalém e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/16/s--alexandre--bispo-de-jerusalem-e-martir.html"
  },
  "05-17": {
    "name": "S. Vítor, mártir, na via Salária Antiga",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/17.html"
  },
  "05-18": {
    "name": "S. João I, papa e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/18/s--joao-i--papa-e-martir.html"
  },
  "05-19": {
    "name": "S. Pedro Celestino V, papa (Pietro del Murrone)",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/19/s--pedro-celestino-v--papa--pietro-del-murrone-.html"
  },
  "05-20": {
    "name": "S. Bernardino de Sena, presbítero franciscano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/20/s--bernardino-de-sena--presbitero-franciscano.html"
  },
  "05-21": {
    "name": "SS. Cristóvão de Magalhães, sac., e Companheiros, mártires no México",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/21/ss--cristovao-de-magalhaes--sac---e-companheiros--martires-no-me.html"
  },
  "05-22": {
    "name": "S. Rita de Cássia, religiosa agostiniana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/22/s--rita-de-cassia--religiosa-agostiniana.html"
  },
  "05-23": {
    "name": "S. João Batista de Rossi, sacerdote romano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/23.html"
  },
  "05-24": {
    "name": "S. Vicente de Lérins, presbítero",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/24.html"
  },
  "05-25": {
    "name": "S. Gregório VII, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/25.html"
  },
  "05-26": {
    "name": "S. Filipe Néri, presbítero, fundador da Congregação dos Padres do Oratório",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/26/s--filipe-neri--presbitero--fundador-da-congregacao-dos-padres-d.html"
  },
  "05-27": {
    "name": "S. Agostinho, arcebispo de Cantuária",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/27/s--agostinho--arcebispo-de-cantuaria.html"
  },
  "05-28": {
    "name": "S. Germano, bispo de Paris",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/28.html"
  },
  "05-29": {
    "name": "S. Úrsula Ledochowska, fundadora das Irmãs Ursulinas do Coração de Jesus Agonizante",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/29.html"
  },
  "05-30": {
    "name": "S. Fernando III, rei de Castela",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/30.html"
  },
  "05-31": {
    "name": "São Félix de Nicósia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/05/31.html"
  },
  "06-01": {
    "name": "S. Justino, filósofo e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/01/s--justino--filosofo-e-martir.html"
  },
  "06-02": {
    "name": "SS. Marcelino, presbítero, e Pedro, exorcista, mártires, na via Labicana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/02/ss--marcelino--presbitero--e-pedro--exorcista--martires--na-via-.html"
  },
  "06-03": {
    "name": "SS. Carlos Lwanga e Companheiros, mártires de Uganda",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/03/ss--carlos-lwanga-e-companheiros--martires-de-uganda.html"
  },
  "06-04": {
    "name": "S. Francisco Caracciolo, presbítero, fundador dos Clérigos Regulares Menores",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/04/s--francisco-caracciolo--presbitero--fundador-dos-clerigos-regul.html"
  },
  "06-05": {
    "name": "S. Bonifácio, bispo e mártir, apóstolo da Alemanha",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/05.html"
  },
  "06-06": {
    "name": "S. Norberto, bispo de Magdeburgo, fundador dos Cônegos Regulares Premostratenses",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/06.html"
  },
  "06-07": {
    "name": "S. Antônio Maria Gianelli, bispo de Bobbio, fundador das Filhas de Maria Santíssima do Horto",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/07.html"
  },
  "06-08": {
    "name": "S. Medardo, bispo de Noyon",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/08.html"
  },
  "06-09": {
    "name": "S. Efrém, diácono e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/09/s--efrem--diacono-e-doutor-da-igreja.html"
  },
  "06-10": {
    "name": "S. Landerico, bispo de Paris",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/10.html"
  },
  "06-11": {
    "name": "S. Barnabé, apóstolo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/11/s--barnabe--apostolo.html"
  },
  "06-12": {
    "name": "S. Leão III, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/12.html"
  },
  "06-13": {
    "name": "S. Antônio de Pádua, sacerdote franciscano e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/13/s--antonio-de-padua--sacerdote-franciscano-e-doutor-da-igreja.html"
  },
  "06-14": {
    "name": "S. Eliseu, profeta",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/14.html"
  },
  "06-15": {
    "name": "S. Vito, mártir em Lucânia na Itália",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/15.html"
  },
  "06-16": {
    "name": "SS. Ciríaco e Julita, mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/16.html"
  },
  "06-17": {
    "name": "SS. Blasto e Diógenes, mártires, na via Salária Antiga",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/17.html"
  },
  "06-18": {
    "name": "SS. Marcos e Marceliano, mártires romanos",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/18/ss--marcos-e-marceliano--martires-romanos.html"
  },
  "06-19": {
    "name": "S. Romualdo, abade, fundador dos Camaldulenses",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/19/s--romualdo--abade--fundador-dos-camaldulenses.html"
  },
  "06-20": {
    "name": "São Silvério, Papa e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/20.html"
  },
  "06-21": {
    "name": "S. Luís Gonzaga, jesuíta, padroeiro da juventude católica",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/21/s--luis-gonzaga--jesuita--padroeiro-da-juventude-catolica.html"
  },
  "06-22": {
    "name": "S. Paulino, bispo de Nola, Itália",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/22.html"
  },
  "06-23": {
    "name": "S. José Cafasso, presbítero de Turim",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/23/s--jose-cafasso--presbitero-de-turim.html"
  },
  "06-24": {
    "name": "SOLENIDADE DO NASCIMENTO DE SÃO JOÃO BATISTA",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/24/solenidade-do-nascimento-de-sao-joao-batista.html"
  },
  "06-25": {
    "name": "S. Guilherme, abade, fundador do Mosteiro de Montevergine",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/25/s--guilherme--abade--fundador--do-mosteiro-de-montevergine.html"
  },
  "06-26": {
    "name": "SS. João e Paulo, mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/26.html"
  },
  "06-27": {
    "name": "S. Cirilo de Alexandria, bispo e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/27/s--cirilo-de-alexandria--bispo-e-doutor-da-igreja.html"
  },
  "06-28": {
    "name": "S. Ireneu, bispo de Lyon e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/28/s--ireneu--bispo-de-lyon-e-martir.html"
  },
  "06-29": {
    "name": "S. Pedro apóstolo, padroeiro da cidade de Roma",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/29/s--pedro-apostolo--padroeiro-da-cidade-de-roma.html"
  },
  "06-30": {
    "name": "SS. Protomártires da Santa Igreja Romana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/06/30.html"
  },
  "07-01": {
    "name": "SS. Júlio e Aarão, mártires da Bretanha",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/01.html"
  },
  "07-02": {
    "name": "SS. Processo e Martiniano, mártires romanos",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/02.html"
  },
  "07-03": {
    "name": "S. Tomé, apostólo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/03/s--tome--apostostolo.html"
  },
  "07-04": {
    "name": "S. Isabel, rainha de Portugal",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/04.html"
  },
  "07-05": {
    "name": "S. Antônio Maria Zacarias, presbítero, fundador dos Barnabitas",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/05.html"
  },
  "07-06": {
    "name": "S. Maria Goretti, virgem e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/06/s--maria-goretti--virgem-e-martir.html"
  },
  "07-07": {
    "name": "Festa de todos os Pontífices Romanos",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/07/festa-de-todos-os-pontifices-romanos.html"
  },
  "07-08": {
    "name": "B. Eugênio III, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/08.html"
  },
  "07-09": {
    "name": "SS. Agostinho Zhao Rong presbítero e Companheiros, mártires chineses",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/09/ss--agostinho-zhao-rong-presbitero-e-companheiros--martires-chin.html"
  },
  "07-10": {
    "name": "SS. Rufina e Segunda, mártires, na via Cornelia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/10.html"
  },
  "07-11": {
    "name": "S. Bento abade, Padroeiro da Europa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/11/s--bento-abade--padroeiro-da-europa.html"
  },
  "07-12": {
    "name": "S. João Gualberto, abade, fundador dos Valombrosanos",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/12.html"
  },
  "07-13": {
    "name": "S. Henrique II, imperador",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/13/s--henrique-ii--imperador.html"
  },
  "07-14": {
    "name": "S. Camilo de Lélis, sacerdote, fundador dos Clérigos Regulares Ministros dos Enfermos",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/14/s--camilo-de-lelis--sacerdote--fundador-dos-clerigos-regulares-m.html"
  },
  "07-15": {
    "name": "S. Boaventura de Bagnoregio, cardeal, bispo de Albano e doutor da Igreja, franciscano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/15/s--boaventura-de-bagnoregio--cardeal--bispo-de-albano-e-doutor-d.html"
  },
  "07-16": {
    "name": "S. Maria Madalena Postel, virgem, fundadora da Congregação das Filhas da Misericórdia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/16.html"
  },
  "07-17": {
    "name": "S. Marcelina, virgem, irmã de S. Ambrósio, bispo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/17.html"
  },
  "07-18": {
    "name": "S. Emiliano, mártir na Mésia (Bulgária)",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/18.html"
  },
  "07-19": {
    "name": "S. Símaco, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/19.html"
  },
  "07-20": {
    "name": "S. Apolinário, bispo de Ravena e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/20/s--apolinario--bispo-de-ravena-e-martir.html"
  },
  "07-21": {
    "name": "S. Praxedes, romana, a cujo título foi dedicada uma igreja no Esquilino",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/21.html"
  },
  "07-22": {
    "name": "S. Maria Madalena, discípula do Senhor",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/22/s--maria-madalena--discipula-do-senhor.html"
  },
  "07-23": {
    "name": "S. Brígida, religiosa, Padroeira da Europa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/23/s--brigida--religiosa--padroeira-da-europa.html"
  },
  "07-24": {
    "name": "S. Charbel Makhluf, persbítero",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/24/s--charbel-makhluf--persbitero.html"
  },
  "07-25": {
    "name": "S. Tiago, o Maior, apóstolo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/25/s--tiago--o-maior--apostolo.html"
  },
  "07-26": {
    "name": "SS. Joaquim e Ana, pais da Imaculada Virgem Mãe de Deus",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/26/ss--joaquim-e-ana--pais-da-imaculada-virgem-mae-de-deus.html"
  },
  "07-27": {
    "name": "S. Pantaleão, médico, mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/27.html"
  },
  "07-28": {
    "name": "B. Urbano II, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/28.html"
  },
  "07-29": {
    "name": "S. Marta, discípula do Senhor",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/29/s--marta--discipula-do-senhor.html"
  },
  "07-30": {
    "name": "S. Pedro Crisólogo, bispo de Ravena e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/30.html"
  },
  "07-31": {
    "name": "S. Inácio de Loiola, presbítero, fundador da Companhia de Jesus",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/07/31/s--inacio-de-loiola--presbitero--fundador-da-companhia-de-jesus.html"
  },
  "08-01": {
    "name": "S. Afonso Maria de Ligório, bispo e doutor da Igreja, fundador da Congregação do Santíssimo Redentor",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/01/s--afonso-maria-de-ligorio--bispo-e-doutor-da-igreja--fundador-d.html"
  },
  "08-02": {
    "name": "S. Eusébio, bispo de Vercelli",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/02.html"
  },
  "08-03": {
    "name": "S. Lídia, discípula de S. Paulo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/03.html"
  },
  "08-04": {
    "name": "S. João Maria Vianney, Cura de Ars, padroeiro do Clero com cura das almas",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/04/s--joao-maria-vianney--cura-de-ars--padroeiro-do-clero-com-cura-.html"
  },
  "08-05": {
    "name": "Santo Osvaldo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/05.html"
  },
  "08-06": {
    "name": "S. Hormisdas, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/06.html"
  },
  "08-07": {
    "name": "SS. Sisto II, papa, e Companheiros, mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/07.html"
  },
  "08-08": {
    "name": "S. Domingos de Gusmão, presbítero, fundador da Ordem dos Pregadores",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/08/s--domingos-de-gusmao--presbitero--fundador-da-ordem-dos-pregado.html"
  },
  "08-09": {
    "name": "S. Teresa Benedita da Cruz (Edith Stein), virgem e mártir carmelita, Padroeira da Europa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/09/s--teresa-benedita-da-cruz--edith-stein---virgem-e-martir-carmel.html"
  },
  "08-10": {
    "name": "S. Lourenço, diácono e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/10/s--lourenco--diacono-e-martir.html"
  },
  "08-11": {
    "name": "S. Clara de Assis, fundadora das Clarissas",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/11/s--clara-de-assis--fundadora-das-clarissas.html"
  },
  "08-12": {
    "name": "S. Joana Francisca de Chantal, religiosa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/12.html"
  },
  "08-13": {
    "name": "SS. Ponciano, papa e Hipólito, presbítero, mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/13.html"
  },
  "08-14": {
    "name": "S. Maximiliano M. Kolbe, presbítero da Ordem dos Frades Menores Conventuais e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/14/s--maximiliano-m--kolbe--presbitero-da-ordem-dos-frades-menores-.html"
  },
  "08-15": {
    "name": "S. Tarcísio, romano, mártir da Eucaristia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/15/s--tarcisio--romano--martir-da-eucaristia.html"
  },
  "08-16": {
    "name": "S. Estêvão, rei da Hungria",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/16.html"
  },
  "08-17": {
    "name": "S. Eusébio, papa e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/17.html"
  },
  "08-18": {
    "name": "S. Agapito, mártir de Palestrina, Itália",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/18.html"
  },
  "08-19": {
    "name": "S. João Eudes, presbítero, fundador dos Eudistas",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/19.html"
  },
  "08-20": {
    "name": "S. Bernardo, abade e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/20/s--bernardo--abade-e-doutor-da-igreja.html"
  },
  "08-21": {
    "name": "S. Pio X, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/21/s--pio-x--papa.html"
  },
  "08-22": {
    "name": "S. Timóteo, mártir romano, na via Ostiense",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/22.html"
  },
  "08-23": {
    "name": "S. Rosa de Lima, virgem, terciária dominicana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/23/s--rosa-de-lima--virgem--terciaria-dominicana.html"
  },
  "08-24": {
    "name": "S. Bartolomeu, apóstolo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/24/s--bartolomeu--apostolo.html"
  },
  "08-25": {
    "name": "S. Luís IX, rei da França",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/25/s--luis-ix--rei-da-franca.html"
  },
  "08-26": {
    "name": "Beato João Paulo I",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/26/beato-joao-paulo-i.html"
  },
  "08-27": {
    "name": "S. Mônica, mãe de S. Agostinho, bispo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/27/s--monica--mae-de-s--agostinho--bispo.html"
  },
  "08-28": {
    "name": "S. Agostinho, bispo de Hipona e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/28/s--agostinho--bispo-de-hipona-e-doutor-da-igreja.html"
  },
  "08-29": {
    "name": "S. Sabina, romana, cujo título, fundado no monte Aventino, venera o seu nome",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/29/-s--sabina--romana--cujo-titulo--fundado-no-monte-aventino--vene.html"
  },
  "08-30": {
    "name": "SS. Félix sacerdote, e Adauto, mártires, na via Ostiense",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/30.html"
  },
  "08-31": {
    "name": "S. Raimundo Nonato, cardeal, sacerdote mercedário",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/08/31.html"
  },
  "09-01": {
    "name": "S. Egídio, abade",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/01/s--egidio--abade.html"
  },
  "09-02": {
    "name": "S. Zenão, mártir de Nicomédia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/02.html"
  },
  "09-03": {
    "name": "S. Gregório Magno, papa e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/03/s--gregorio-magno--papa-e-doutor-da-igreja.html"
  },
  "09-04": {
    "name": "S. Bonifácio I, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/04.html"
  },
  "09-05": {
    "name": "SS. Aconto, Nono, Herculano e Taurino, mártires de Porto Romano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/05.html"
  },
  "09-06": {
    "name": "S. Zacarias, profeta",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/06.html"
  },
  "09-07": {
    "name": "S. Regina, virgem e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/07.html"
  },
  "09-08": {
    "name": "S. Sérgio I, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/08.html"
  },
  "09-09": {
    "name": "S. Pedro Claver, presbítero jesuíta, apóstolo entre os negros deportados",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/09/s--pedro-claver--presbitero-jesuita--apostolo-entre-os-negros-de.html"
  },
  "09-10": {
    "name": "S. Nicolau de Tolentino, presbítero agostiniano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/10.html"
  },
  "09-11": {
    "name": "SS. Proto e Jacinto, mártires, na via Salaria",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/11.html"
  },
  "09-12": {
    "name": "S. Guido de Brabante",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/12/s--guido-de-brabante.html"
  },
  "09-13": {
    "name": "S. João Crisóstomo, bispo e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/13/s--joao-crisostomo--bispo-de-doutor-da-igreja.html"
  },
  "09-14": {
    "name": "S. Alberto, patriarca de Jerusalém",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/14.html"
  },
  "09-15": {
    "name": "S. Nicomedes, mártir, na via Nomentana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/15.html"
  },
  "09-16": {
    "name": "SS. Cornélio, papa e Cipriano, bispo, mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/16/ss--cornelio--papa-e-cipriano--bispo--martires.html"
  },
  "09-17": {
    "name": "S. Roberto Belarmino, cardeal, bispo e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/17.html"
  },
  "09-18": {
    "name": "S. José de Cupertino",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/18/-s--jose-de-cupertino-da-copertino--sacerdote-francescano.html"
  },
  "09-19": {
    "name": "S. Januário, bispo de Benevento e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/19/s--januario--bispo-de-benevento-e-martir-.html"
  },
  "09-20": {
    "name": "SS. André Kim Tae-gon, presbítero, e Paulo Chong Ha-sang e Companheiros, mártires coreanos",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/20/ss--andre-kim-tae-gon--presbitero--e-paulo-chong-ha-sang-e-compa.html"
  },
  "09-21": {
    "name": "S. Mateus, apóstolo e evangelista",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/21/s--mateus--apostolo-e-evangelista.html"
  },
  "09-22": {
    "name": "SS. Maurício e Companheiros, soldados e mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/22.html"
  },
  "09-23": {
    "name": "S. Pio de Pietrelcina, presbítero",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/23/s--pio-de-pietrelcina--presbitero.html"
  },
  "09-24": {
    "name": "S. Pacífico de S. Severino, sacerdote franciscano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/24.html"
  },
  "09-25": {
    "name": "S. Firmino, bispo de Amiens e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/25.html"
  },
  "09-26": {
    "name": "SS. Cosme e Damião, mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/26/ss--cosme-e-damiao--martires.html"
  },
  "09-27": {
    "name": "S. Vicente de Paulo, sacerdote, fundador da Congregação da Missão e das Filhas da Caridade, Padroeiro de todas as Associações de Caridade",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/27/s--vicente-de-paulo--sacerdote--fundador-da-congregacao-da-missa.html"
  },
  "09-28": {
    "name": "S. Venceslau, duque da Boêmia, mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/28.html"
  },
  "09-29": {
    "name": "B. Nicolau de Furca Palena, presbítero da Ordem de S. Jerônimo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/29.html"
  },
  "09-30": {
    "name": "S. Jerônimo, presbítero e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/09/30/s--jeronimo---presbitero-e-doutor-da-igreja.html"
  },
  "10-01": {
    "name": "S. Teresa do Menino Jesus, virgem carmelita, doutora da Igreja, padroeira das Missões",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/01/s--teresa-do-menino-jesus--virgem-carmelita--doutora-da-igreja--.html"
  },
  "10-02": {
    "name": "SS. Anjos da Guarda",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/02/ss--anjos-da-guarda.html"
  },
  "10-03": {
    "name": "S. Cândida, mártir na via Portuense",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/03.html"
  },
  "10-04": {
    "name": "S. Francisco de Assis, fundador da Ordem franciscana, Padroeiro da Itália",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/04/s--francisco-de-assis--fundador-da-ordem-franciscana--padroeiro-.html"
  },
  "10-05": {
    "name": "SS. Plácido e Mauro, discípulos de S. Bento",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/05.html"
  },
  "10-06": {
    "name": "S. Bruno da Calábria, presbítero, fundador da Ordem dos Cartuxos",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/06/s--bruno-da-calabria--presbitero--fundador-da-ordem-dos-cartuxos.html"
  },
  "10-07": {
    "name": "S. Marcos, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/07.html"
  },
  "10-08": {
    "name": "S. Pelágia, virgem e mártir da Antioquia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/08.html"
  },
  "10-09": {
    "name": "SS. Dinís, bispo, e Companheiros, mártires de Paris",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/09.html"
  },
  "10-10": {
    "name": "S. Paulino, bispo de York, discípulo de S. Gregório Magno",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/10.html"
  },
  "10-11": {
    "name": "S. Filipe, diácono",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/11.html"
  },
  "10-12": {
    "name": "S. Hedisto, mártir, na via Ardeatina",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/12.html"
  },
  "10-13": {
    "name": "S. Teófilo, bispo de Antioquia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/13.html"
  },
  "10-14": {
    "name": "S. Calisto I, papa e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/14.html"
  },
  "10-15": {
    "name": "S. Teresa de Jesus, virgem, doutora da Igreja, carmelita descalça",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/15/s--teresa-de-jesus--virgem--doutora-da-igreja--carmelita-descalc.html"
  },
  "10-16": {
    "name": "S. Edviges, duquesa da Silésia, religiosa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/16/s--edviges--duquesa-da-silesia--religiosa.html"
  },
  "10-17": {
    "name": "S. Inácio de Antioquia, bispo, mártir em Roma",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/17/s--inacio-de-antioquia--bispo--martir-em-roma.html"
  },
  "10-18": {
    "name": "S. Lucas, evangelista, médico, padroeiro dos artistas",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/18/s--lucas--evangelista--medico--padroeiro-dos-artistas.html"
  },
  "10-19": {
    "name": "SS. João de Brébeuf e Isaac Jogues presbíteros, e Companheiros jesuítas, mártires canadenses",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/19/ss--joao-de-brebeuf-e-isaac-jogues-presbiteros--e-companheiros-j.html"
  },
  "10-20": {
    "name": "S. Maria Bertila Boscardin, virgem de Treviso",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/20.html"
  },
  "10-21": {
    "name": "S. Gaspar del Búfalo, presbítero, fundador dos Missionários do Preciosíssimo Sangue de Cristo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/21/s--gaspar-del-bufalo--presbitero--fundador-dos-missionarios-do-p.html"
  },
  "10-22": {
    "name": "S. João Paulo II, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/22/s--joao-paulo-ii--papa.html"
  },
  "10-23": {
    "name": "S. João de Capistrano, presbítero franciscano, padroeiro dos capelães militares",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/23/s--joao-de-capistrano--presbitero-franciscano--padroeiro-dos-cap.html"
  },
  "10-24": {
    "name": "S. Antônio Maria Claret, bispo, fundador da Congregação dos Missionários Filhos do Coração Imaculado da Virgem Maria",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/24/s--antonio-maria-claret--bispo--fundador-da-congregacao-dos-miss.html"
  },
  "10-25": {
    "name": "SS. Crisanto e Daria, mártires, na via Salária Nova",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/25.html"
  },
  "10-26": {
    "name": "S. Demétrio, mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/26.html"
  },
  "10-27": {
    "name": "S. Evaristo, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/27.html"
  },
  "10-28": {
    "name": "SS. Simão e Judas (Tadeu), apóstolos",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/28/ss--simao-e-judas--tadeu---apostolos.html"
  },
  "10-29": {
    "name": "S. Feliciano, mártir de Cartago",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/29.html"
  },
  "10-30": {
    "name": "S. Germano, bispo de Cápua",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/30.html"
  },
  "10-31": {
    "name": "S. Afonso Rodriguez, religioso jesuíta",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/10/31.html"
  },
  "11-01": {
    "name": "TODOS OS SANTOS",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/01/todos-os-santos.html"
  },
  "11-02": {
    "name": "COMEMORAÇÃO DE TODOS OS FIÉIS DEFUNTOS",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/02/comemoracao-de-todos-os-fieis-defuntos.html"
  },
  "11-03": {
    "name": "S. Martinho de Porres, religioso dominicano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/03/s--martinho-de-porres--religioso-dominicano.html"
  },
  "11-04": {
    "name": "S. Carlos Borromeu, arcebispo de Milão e cardeal",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/04/s--carlos-borromeu--arcebispo-de-milao-e-cardeal.html"
  },
  "11-05": {
    "name": "SS. Donino, Teótimo e Companheiros, mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/05.html"
  },
  "11-06": {
    "name": "S. Leonardo, eremita",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/06.html"
  },
  "11-07": {
    "name": "S. Prosdócimo, primeiro bispo de Pádua",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/07.html"
  },
  "11-08": {
    "name": "SS. Quatro Coroados, mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/08.html"
  },
  "11-09": {
    "name": "S. Teodoro, soldado, mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/09.html"
  },
  "11-10": {
    "name": "S. Leão Magno, papa e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/10/s--leao-magno--papa-e-doutor-da-igreja.html"
  },
  "11-11": {
    "name": "S. Bartolomeu, abade de Grottaferrata",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/11/s--bartolomeu--abade-de-grottaferrata.html"
  },
  "11-12": {
    "name": "S. Diego, leigo franciscano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/12.html"
  },
  "11-13": {
    "name": "S. Nicolau I, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/13.html"
  },
  "11-14": {
    "name": "S. Serapião",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/14.html"
  },
  "11-15": {
    "name": "S. Alberto Magno, bispo e doutor da Igreja, dominicano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/15/s--alberto-magno--bispo-e-doutor-da-igreja--dominicano.html"
  },
  "11-16": {
    "name": "S. Margarida da Escócia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/16/s--margarida-da-escocia.html"
  },
  "11-17": {
    "name": "S. Isabel da Hungria, terciária franciscana",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/17.html"
  },
  "11-18": {
    "name": "S. Filipina Rosa Duchesne",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/18.html"
  },
  "11-19": {
    "name": "S. Matilde (Mechtilde), virgem",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/19.html"
  },
  "11-20": {
    "name": "S. Gelásio I, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/20.html"
  },
  "11-21": {
    "name": "B. Maria de Jesus do Bom Pastor, fundadora das Irmãs da Sagrada Família de Nazaré",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/21.html"
  },
  "11-22": {
    "name": "S. Cecília, virgem e mártir, no cemitério de Calisto",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/22/s--cecilia--virgem-e-martir--no-cemiterio-de-calisto.html"
  },
  "11-23": {
    "name": "S. Clemente I, papa e mártir: suas relíquias são veneradas na igreja com seu nome",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/23.html"
  },
  "11-24": {
    "name": "S. Crisógono, mártir de Aquileia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/24/s--crisogono--martir-de--aquileia.html"
  },
  "11-25": {
    "name": "S. Moisés, mártir em Roma",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/25.html"
  },
  "11-26": {
    "name": "S. Sirício, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/26.html"
  },
  "11-27": {
    "name": "S. Virgílio, bispo de Salzburgo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/27/s--virgilio--bispo-de-salzburgo.html"
  },
  "11-28": {
    "name": "S. Tiago da Marca, sacerdote franciscano",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/28.html"
  },
  "11-29": {
    "name": "S. Saturnino, mártir na via Salária Nova",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/29.html"
  },
  "11-30": {
    "name": "S. André, apóstolo",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/11/30/s--andre--apostolo.html"
  },
  "12-01": {
    "name": "São Charles de Foucauld",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/01/sao-charles-de-foucauld.html"
  },
  "12-02": {
    "name": "S. Bibiana, matrona romana, a quem foi dedicada uma igreja no Esquilino",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/02.html"
  },
  "12-03": {
    "name": "S. Francisco Xavier, presbítero jesuíta, evangelizador das Índias, padroeiro das Missões",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/03/s--francisco-xavier--presbitero-jesuita--evangelizador-das-india.html"
  },
  "12-04": {
    "name": "S. João Damasceno, presbítero e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/04/s--joao-damasceno--presbitero-e-doutor-da-igreja.html"
  },
  "12-05": {
    "name": "S. Sabas, abade",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/05.html"
  },
  "12-06": {
    "name": "S. Nicolau de Bari, bispo de Mira",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/06/s--nicolau-de-bari--bispo-de-mira.html"
  },
  "12-07": {
    "name": "S. Ambrósio, bispo de Milão e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/07/s--ambrosio--bispo-de-milao-e-doutor-da-igreja.html"
  },
  "12-08": {
    "name": "S. Eutiquiano papa, no cemitério de Calisto",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/08.html"
  },
  "12-09": {
    "name": "S. João Diogo Cuauhtlatoatzin",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/09/s--joao-diogo-cuauhtlatoatzin.html"
  },
  "12-10": {
    "name": "Nossa Senhora de Loreto",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/10/nossa-senhora-de-loreto.html"
  },
  "12-11": {
    "name": "S. Dâmaso I, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/11.html"
  },
  "12-12": {
    "name": "Nossa Senhora de Guadalupe",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/12/nossa-senhora-de-guadalupe.html"
  },
  "12-13": {
    "name": "S. Luzia, virgem e mártir de Siracusa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/13/s--luzia--virgem-e-martir-de-siracusa.html"
  },
  "12-14": {
    "name": "S. João da Cruz, presbítero e doutor da Igreja, carmelita descalço",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/14/s--joao-da-cruz--presbitero-e-doutor-da-igreja--carmelita-descal.html"
  },
  "12-15": {
    "name": "S. Valeriano, bispo na África e mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/15.html"
  },
  "12-16": {
    "name": "S. Davi, rei e profeta",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/16.html"
  },
  "12-17": {
    "name": "S. Daniel, profeta",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/17.html"
  },
  "12-18": {
    "name": "S. Malaquias, profeta",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/18.html"
  },
  "12-19": {
    "name": "B. Urbano V, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/19.html"
  },
  "12-20": {
    "name": "S. Filogônio, bispo de Antioquia",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/20.html"
  },
  "12-21": {
    "name": "S. Pedro Canisio, presbítero jesuíta e doutor da Igreja",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/21/s--pedro-canisio--presbitero-jesuita-e-doutor-da-igreja.html"
  },
  "12-22": {
    "name": "S. Francisca Xavier Cabrini, virgem, fundadora do Instituto das Missionárias do Sagrado Coração de Jesus",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/22/s--francisca-xavier-cabrini--virgem--fundadora-do-instituto-das-.html"
  },
  "12-23": {
    "name": "S. João de Kenty, sacerdote",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/23.html"
  },
  "12-24": {
    "name": "S. Tarsila, virgem romana, tia de S. Gregório Magno",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/24.html"
  },
  "12-25": {
    "name": "S. Anastásia, mártir de Sírmium",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/25.html"
  },
  "12-26": {
    "name": "S. Estêvão, primeiro mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/26/s--estevao--primeiro-martir.html"
  },
  "12-27": {
    "name": "S. João, apóstolo e evangelista",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/27/s--joao--apostolo-e-evangelista.html"
  },
  "12-28": {
    "name": "SS. Inocentes, mártires",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/28/ss--inocentes--martires.html"
  },
  "12-29": {
    "name": "S. Tomás Becket, bispo de Cantuária, mártir",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/29/s--tomas-becket--bispo-de-cantuaria--martir.html"
  },
  "12-30": {
    "name": "S. Félix I, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/30.html"
  },
  "12-31": {
    "name": "S. Silvestre I, papa",
    "sourceUrl": "https://www.vaticannews.va/pt/santo-do-dia/12/31/s--silvestre-i--papa.html"
  }
}
);

export function localDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

export function getSaintOfDay(date: Date): SaintOfDayRecord | null {
  return SAINTS_BY_DATE[localDateKey(date)] ?? null;
}
