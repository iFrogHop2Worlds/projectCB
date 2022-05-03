import axios from 'axios';
import * as cheerio from 'cheerio';
const url = "https://www.iban.com/exchange-rates";

const fetchData = async (url) => {
    let response = await axios(url)
        .catch(e => {
            console.log(e)
        });    
    if(response.status !== 200){
        console.error("Error occured while trying to fetch data");
        return;
    }
    console.log("creepy crawlin yo");
    return response;
}
//table table-bordered table-hover downloads
fetchData(url).then(res => {
    const html = res.data;
    const $ = cheerio.load(html);
    const statsTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');
    statsTable.each(function() {
        let title = $(this).find('td').text();
        console.log(title);
    });
})
