export interface Card {
    cardname?: string
    cardpictureLink?: string
    cardattribute?: string
    cardtype?: string
    cardrace?: string
    cardcode?: string
    cardset?:{
        cardsetCode?: string,
        cardsetName?: string
    }
    cardstock?: number
    cardprice?: number
}
