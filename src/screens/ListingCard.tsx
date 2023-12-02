import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { headers } from '../utils/constant';
import Nft from '../types/NftType';
import Listing from '../types/Listing';

function ListingCard({ listing }: { listing: Listing }) {


    const [nft, setNft] = useState<Nft | null>(null)

    const fetchListingDetails = async () => {

        const contractAddress = listing.protocol_data.parameters.offer[0].token;
        const tokenId = listing.protocol_data.parameters.offer[0].identifierOrCriteria;

        // const url = `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}`;
        const url = `https://api.opensea.io/v2/chain/bsc/contract/${contractAddress}/nfts/${tokenId}`


        const res = await axios.get(url, {
            headers: headers
        })

        setNft(res.data.nft)
    }


    useEffect(() => {
        fetchListingDetails()
    }, [])

    const formatPrice = (priceValue: string, decimals: number, currencySymbol: string): string => {
        const priceInBNB = parseFloat(priceValue) / 10 ** decimals;
        const formattedPrice = priceInBNB.toLocaleString(undefined, { minimumFractionDigits: 2 });

        return `${formattedPrice} ${currencySymbol}`;
    }



    if (!nft) {
        return (
            <span>Loading...</span>
        )
    }

    return (
        <div className='nft-card'>
            <img src={nft.image_url} alt={nft.name} />
            <div className="nft-info">
                <h6>{nft.name}</h6>
                <h4>{formatPrice(listing.price.current.value, listing.price.current.decimals, listing.price.current.currency)}</h4>
            </div>
        </div>
    )
}

export default ListingCard