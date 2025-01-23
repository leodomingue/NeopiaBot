const axios = require("axios");
const cheerio = require("cheerio");
const _categories = new Map();
const _specialCategories = new Map();

module.exports = {
    description: "API para scrapear e interactuar con items.jellyneo.net",
    //TODO: Cambiar then por await
    getCategories: async () => {
        if(!_categories.size){
            console.log("Cargando Categorias")
            
            await axios.get("https://items.jellyneo.net/search")
            .then(function (response) {

                const $ = cheerio.load(response.data);

                // Cargamos las categorias y tiendas de objetos, con su respectivo Id en jellyneo
                const $searchCategories = $("#search-category option");
                for (const category of $searchCategories) {
                    const $category = $(category);
                    _categories.set($category.text(), $category.attr('value'));
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }

        return _categories
    },
    getSpecialCategories: async () => {
        if(!_specialCategories.size){
            console.log("Cargando Categorias Especiales")
            
            await axios.get("https://items.jellyneo.net/search")
            .then(function (response) {
                const $ = cheerio.load(response.data);

                // Cargamos las categorias especiales, con su respectivo Id en jellyneo
                const $searchSpecialCategories = $("#search-special-category option");
                const searchSpecialCategories = new Map();
                for (const category of $searchSpecialCategories) {
                    const $category = $(category);
                    _specialCategories.set($category.text(), $category.attr('value'));
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }

        return _specialCategories
    },
    itemDataByID: async (item) => {
    try {
            //CODIGO ORIGINAL https://github.com/leodomingue/Scraaping-Neopets.git
            const url = `https://items.jellyneo.net/item/${item}/`;
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
    
            // Se encuentra toda la informacion
            const principalTargetDiv = $('div.row .large-9.small-12.columns.content-wrapper');
            if (!principalTargetDiv) return null;
    
            const title = principalTargetDiv.find('h1').text().trim();
    
            const firstSecondaryTargetDiv =  principalTargetDiv.find('div.large-3.push-2.small-12.columns');
            const imgSrc = firstSecondaryTargetDiv.find('p.text-center img').attr('src');
            const category = firstSecondaryTargetDiv.find('ul.small-block-grid-2.large-block-grid-1.no-padding li:nth-of-type(2)').find('a').text().trim();
    
            const secondSecondaryTargetDiv = principalTargetDiv.find('div.large-7.push-2.small-12.columns');
    
            const description = secondSecondaryTargetDiv.find("p").first().find('em').text().trim();
    
            let price;
    
            if (secondSecondaryTargetDiv.find("h3.entry-profile-header").text().split(' ')[0] === "DescriptionNeocash"){
                price =secondSecondaryTargetDiv.find("div.row .small-4.columns.text-center p strong.nc-text").text().trim();
            } else{
                price = secondSecondaryTargetDiv.find('div.pricing-row-container .price-row').text().split(' ')[0] + " " + secondSecondaryTargetDiv.find('div.pricing-row-container .price-row').text().split(' ')[1]
            }
    
            return { title, imgSrc, category, description, price };

        } catch (error) {
            console.error("Error durante el scraping:", error.message);
            return null;
        }
    },
    itemSearchQuery: async (args) => {
        
        /*
        name: String to compare ith the name of the item
        name_type: The way to compare {name} with the item's name [1: Partial | 2: Contains | 3: Exact]
        cat[]: Array of the Shop/Category IDs where we are looking in. An empty array means all categories
        scat[]: Array of Special Categories IDs where we are looking in. An empty array means all categories
        scat_type: Treat the categories like an OR or AND [1: Any Selected | 2: All Selected]
        scat_active: Show only items currently un/available in the categories selected [None: Either | 0: Unavailable | 1: Available]
        min_rarity: Minimun Rarity 
        max_rarity: Maximun Rarity
        min_price: Minimun Price 
        max_price: Maximun Price
        exclude_nc: Exclude NeoCash items [None: No | 1: Yes]
        limit: number of items by page
        */

        /*TODO: HACER QUE SE PUEDA AVANZAR DE PAGINA*/
        try {
                //CODIGO ORIGINAL https://github.com/leodomingue/Scraaping-Neopets.git
                const url = `https://items.jellyneo.net/search/`;
                const { data } = await axios.get(url, {
                    params: args
                    }
                );
                const $ = cheerio.load(data);
        
                // Se encuentra toda la informacion
                const resultCount = $("div.large-9.small-12.columns.content-wrapper b").text()
                const $mainQueryResultsDiv = $("div.jnflex-grid.no-side-margin.small-3-per-row.large-5-per-row.text-center.word-wrap-break-word")
                const $divsItemsResult = $mainQueryResultsDiv.children("div")

                const queryResult = []
                $divsItemsResult.each((index, item) => {
                    const $item = $(item);
                    const $itemData = $item.find("a");
                    const itemLink = $($item.find('a')[0]).attr("href")
                    const itemImg = $($item.find('a')[0]).find('img').attr("src")

                    const itemImgTitle = $($item.find('a')[0]).find('img').attr("title")
                    const itemRarity = itemImgTitle.substring(itemImgTitle.lastIndexOf("-") + 3)
                    
                    const itemName = $($item.find('a')[1]).text()
                    
                    const itemStruct = {
                        "itemLink" : itemLink,
                        "itemImg": itemImg,
                        "itemRarity": itemRarity,
                        "itemName": itemName
                    } 

                    if ($itemData[2]){
                        const itemPrice = $($item.find('a')[2]).text();
                        itemStruct.itemPrice = itemPrice;
                    }

                    queryResult.push(itemStruct);

                });
                return {resultCount, queryResult};
    
            } catch (error) {
                console.error("Error durante el scraping:", error.message);
                return null;
            }
    },
    PhotoDataByID: async (item) => {
        try {
                const url = `https://items.jellyneo.net/item/${item}/`;
                const { data } = await axios.get(url);
                const $ = cheerio.load(data);
        
                
                const principalTargetDiv = $('div.row .large-9.small-12.columns.content-wrapper');
                if (!principalTargetDiv) return null;
        
        
                const firstSecondaryTargetDiv =  principalTargetDiv.find('div.large-3.push-2.small-12.columns');
                const imgSrc = firstSecondaryTargetDiv.find('p.text-center img').attr('src');
                
        
                return { imgSrc};
    
            } catch (error) {
                console.error("Error durante el scraping:", error.message);
                return null;
            }
        }
};
