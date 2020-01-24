const isCurOnLast = lastPage => {
    let curPage = $(location).attr('href').split('view').pop()
     if(curPage === ''){
        curPage = "1"
    }else{
        curPage = curPage.split('=').pop()
    }
    if(curPage === lastPage){
        return true
    }
    return false
}

const reset = () => {chrome.storage.local.clear()}

let pres = 0
let totalLec = 0
//Count Present Fields
const fields = $.makeArray($('.table.table-bordered.table-striped.table-hover tbody tr td:nth-child(2)'))
fields.forEach(field => {
    if(field.innerText === 'Present'){
        pres++
    }
})
//Total lectures in current page
totalLec = fields.length

//Display Current Page Data
console.log(`Current Page Data -> Total: ${totalLec} Present: ${pres}`)

chrome.storage.local.get(["totalPresent", "totalLecture"], res => {
    //get previous presents/total lectures
    prevPres = res.totalPresent
    prevLec = res.totalLecture
    if(!prevPres && !prevLec){
        prevPres = 0
        prevLec = 0
    }
    //Store data
    chrome.storage.local.set({"totalPresent" : pres + prevPres})
    chrome.storage.local.set({"totalLecture" : totalLec + prevLec})
    chrome.storage.local.get(["totalPresent", "totalLecture"], res => {
        //display total data
        console.log(`Total Data -> Lectures: ${res.totalLecture} Present: ${res.totalPresent}`)
        //display percentage
        console.log(`Attendance % : ${((res.totalPresent / res.totalLecture)  * 100).toFixed(2)}`)
    })
    //Get last page
    const lastPage = $('.pagination li:nth-last-child(2)')[0].innerText
    //If current page is the last page, reset all data
    if(isCurOnLast(lastPage)){
        reset()
    }
})