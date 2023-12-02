import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react'
import './Collection.css'

import { useParams } from 'react-router-dom';
import { headers } from '../utils/constant';
import Nft from '../types/NftType';
import Collection from '../types/CollectionType';
import ListingCard from './ListingCard';


function CollectionScreen() {
    const { slug } = useParams()

    const [loading, setLoading] = useState(true)

    const [collection, setCollection] = useState<Collection | null>(null)
    const [listings, setListings] = useState([])
    const [nfts, setNfts] = useState<Nft[]>([])

    const [listType, setListType] = useState(0)


    const fetchCollection = async () => {
        const res = await axios.get(`https://api.opensea.io/api/v1/collection/${slug}`, {
            headers: headers
        })

        setCollection(res.data.collection)
    }


    const fetchListings = async () => {
        const res = await axios.get(`https://api.opensea.io/v2/listings/collection/${slug}/all`, {
            headers: headers
        })

        setListings(res.data.listings)

    }

    const fetchNfts = async () => {
        const res = await axios.get(`https://api.opensea.io/api/v2/collection/${slug}/nfts`, {
            headers: headers
        })

        setNfts(res.data.nfts)

    }


    const initialFetch = () => {
        Promise.all([fetchCollection(), fetchListings(), fetchNfts()]).then(([collectionRes, listingsRes, nftsRes]) => {
            setLoading(false)
        }).catch((err) => console.error(err))
    }

    useEffect(() => {
        initialFetch()
    }, [])

    const renderlistings = useCallback(
        () => (
            <>
                {listings.map((listing, index): any => {
                    return (
                        <ListingCard key={index} listing={listing} />
                    )
                })}
            </>
        ),
        [listings])

    if (loading) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className='collection-con'>
            <div className="collection-info-con">
                <div className='collection-banner'>
                    {collection?.banner_image_url && <img src={collection?.banner_image_url} alt={collection?.slug} />}
                </div>
                <div className="collection-info">
                    <div className='collection-display'>
                        {collection?.image_url && <img src={collection?.image_url} alt={collection.slug} className='collection-img' />}
                        <h2 className='title-slug'>{slug}</h2>
                    </div>
                    <ul>
                        <li>
                            <b>Count :</b> {collection?.stats.count}
                        </li>
                        <li>
                            <b>Floor Price :</b> {collection?.stats.floor_price}
                        </li>
                        <li>
                            <b>Desc :</b> {collection?.description}
                        </li>
                    </ul>
                </div>
            </div>
            <div className='collection-assets'>
                <div className='collection-assets-filter'>
                    <h4>Filters</h4>
                    <div className='filter-option' onClick={() => { setListType(0) }}>
                        <label htmlFor="listings">listings</label>
                        <input type="checkbox" name="listings" className="checkbox-input" checked={listType === 0} />
                    </div>
                    <div className='filter-option' onClick={() => { setListType(1) }}>
                        <label htmlFor="all">all</label>
                        <input type="checkbox" name="all" className="checkbox-input" checked={listType === 1} />
                    </div>
                </div>
                <div className="grid">
                    {listType === 0 ? renderlistings() :
                        nfts.map((nft, index): any => {
                            return (
                                <div key={index} className='nft-card'>
                                    <img src={nft.image_url} alt={nft.name} />
                                    <div className="nft-info">
                                        <h6>{nft.name}</h6>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

export default CollectionScreen