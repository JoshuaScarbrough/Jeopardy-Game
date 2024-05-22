// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

// This is the api that gives you the data with the different ids. 
const apiUrlEndpoint = "https://rithm-jeopardy.herokuapp.com/api/categories?count=100"
// This is the number of categories that you need to fill out the gameboard
// The instructions call for 6 
const NUM_CATEGORIES = 14;
const NUM_QUESTIONS_PER_CAT = 5;
let categories = [];
const header = document.querySelector("#header")
const startButton = document.querySelector("#start")
let bodyDiv01 = document.querySelector("div")

// Create the variation in pages
function startFillTable(evt){
    const startButton = evt.target
    console.log(startButton)

    startButton.remove(startButton)

    const restartButton = document.createElement("button")
    restartButton.id = "restartButton1"
    restartButton.innerHTML = "Restart!"
    header.append(restartButton)

    fillTable()

    restartButton.addEventListener("click", function(){
        console.log("yesssirrr")
        bodyDiv01.innerHTML = ""
        fillTable()
    
    })
}
startButton.addEventListener("click", startFillTable)


/** Get 6 random category from API.
 *
 * Returns array of category ids
 */

// Get 6 catagories from the api by their category Id
async function getCategoryIds() {
   
    // Call to the api endpoint that gives you the data with the different ids
    const res = await axios.get(apiUrlEndpoint)

    // Name for an empty array that we are going to push the random categoryIds too.
    const catIds = [];

    // Loop thats going to loop through the number of Cat Ids needed. The instructions call for 6 random category Ids out of the potential 14
    for(let i = 0; i < NUM_CATEGORIES; i++){

        // variable for creating the random number that will grab the needed index so that we can call the random Ids out of the data
        let randNum = Math.floor(Math.random() * 14)

            // If loop thats going to determine if there are repeating random numbers. We are using the .includes method that returns true or false. 
            // If catIds the array does not include the random id then push the id to the catIds array
            if(!catIds.includes(res.data[randNum].id)){
                catIds.push(res.data[randNum].id)
            }
        
    }

    return catIds.slice(0,6)
    
}


/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

// The reason why when you call this function and it gives you an error is because this function was never meant to be called alone. 
// The set up and start function was supposed to be called so that you can get the value of catId which is the parameter that the function needs.
// Calling the function will work if you manually insert a catId
// This function needs to be called 6 different times for all the different Ids. It is only meant to retrieve one set of questions and answers at a time. 
async function getCategory(catId) {

    // This is the enpoint that gets the 5 questions that go along with the categories. 
    // Your using a string template literal because you don't know what the id your going to be using is. 
    // Remember that this function is only retreiving the list of questions of one id at a time... not for the whole array of ids.
    const apiurlEnd2 = `https://rithm-jeopardy.herokuapp.com/api/category?id=${catId}`


    let res2 = await axios.get(apiurlEnd2)

    console.log(res2.data)
    return res2.data

}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    // This is the endpoint for the api that gives you the different catagory data, their ids, and title 
    const res01 = await axios.get(apiUrlEndpoint)
    const res01Data = res01.data

    // Call to the getCategoryIds function and giving it a variable name
    const catagoryIds = await getCategoryIds()
    // Call to the setupAndStart function and giving it a variable name
    const questions = await setupAndStart()

    const bodyDiv = document.querySelector("div")
    // Creation of the base table 
    const table = document.createElement("table")
    bodyDiv.append(table)
    // Creation of the thead section
    const tableHead = document.createElement("thead")
    table.append(tableHead)
    // add th headers 
    const tableRow = document.createElement("tr")
    tableHead.append(tableRow)

    // add th by cate
    // Map(6) {'time' => Array(5), '"cat" egory' => Array(5), '"hard"' => Array(5), '"ac"/"dc"' => Array(5), 'inventions' => Array(5), …}

    // iterate over the questions map object

    questions.forEach(
        (value, key) => {
            const tabledata = document.createElement("th")
            tableRow.append(tabledata)
            tabledata.classList.add("th")
            tabledata.innerHTML = key
        }
    )

    const tableBody = document.createElement("tbody")
    table.append(tableBody)
    var count  = 0;

    // // for every cateragory go through 1 to 5  by iterating questions 
    // // row 0 .. 4 /.. i.e respective 
    
    for(let j = 0; j < NUM_QUESTIONS_PER_CAT; j++){
        // create a row tr 
        const tablerow = document.createElement("tr")
        tableBody.append(tablerow)

        
        // iterate over questions 

        questions.forEach( // get ith question from every category
            (value, key) => {
                const tabledata = document.createElement("td")
                tablerow.append(tabledata)
                // add id to tabledata
                tabledata.id = "t"+(count + 1);
                

                tabledata.classList.add("td")

                // div object that by default displays question and onclick display answer
                // style : hidden  or block

                // const divobj = document.createElement("div")

                // div obj handles event lisstener to observe userclick

                tabledata.onclick = handleClick

                // ???
                const qDiv = document.createElement("div")
                tabledata.append(qDiv)
                qDiv.innerHTML = "???"
                qDiv.style.display = "none"
                qDiv.id = "?"+ (count+1);


                // answer div 

                const answerDiv = document.createElement("div")
                tabledata.append(answerDiv)
                answerDiv.innerHTML = value[j].answer
                // style of divobj to be hidden

                answerDiv.style.display = "none"

                answerDiv.id = "a"+ (count+1);


                // question div

                const questionDiv = document.createElement("div")
                tabledata.append(questionDiv)
                questionDiv.innerHTML = value[j].question

                questionDiv.style.display = "block"

                questionDiv.id = "q"+ ( count+1);


                count = count + 1;


                // tabledata.innerHTML = value[j].question
            }
        )

    }




}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    // log the evt
    console.log(evt)

    // get the id of the target
    const id = evt.target.id

    // slice id to [1:]

    // "t1"  "a1"  "q1"   

    //    abcdef
    //   1  ==> bcdef

    const slicedId = id.slice(1)

    document.getElementById(
        "?"+slicedId
    ).style.display = "none"

    document.getElementById(
        "q"+slicedId
    ).style.display = "none";

    document.getElementById(
        "a"+slicedId
    ).style.display = "block";

}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {



}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

// Most important function on the page. It brings all the main functions on the page together
// If you read the description then you can see that this function gets a random catId, gets the data for it, and creates the table for it
async function setupAndStart() {

    // This variable calls the getCategoryIds() function. You must use the await keyword anytime you are pulling something off the api.
    const catagoryIds = await getCategoryIds()

    // This is an empty object that we will be pushing the clues to for the different random categoryIds
    // Questions and Answers
    const qas = new Map();

    // Most important for loop on the page. 
    // For every id in thr catagoryIds array. This is gonna give you the specific clues for all the random ids
    for(let id of catagoryIds){
        // Variable that assigns the getCatagory function with the id of the catagoryIds function.
        // Must use await because you are pulling this information off the api
        const qa = await getCategory(id)
        
        // Now your pushing the gotten catagory with the ids from the random id array with the clues only to the qas array.
        qas.set(qa.title,qa.clues)
    }

    // your going to call the fillTable function and fill it with the Questions and Answers / Clues 
    // fillTable(qas)
    console.log(qas)
    return qas

}


/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO