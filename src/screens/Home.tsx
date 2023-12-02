import React, { useState, useEffect, useCallback } from 'react';
import Collection from '../types/CollectionType';
import axios from 'axios';
import { Link } from 'react-router-dom';


const headers = {
    "X-API-KEY": "f2e92a5301c34ea590a8f3838dcb973c"
}

const listingsURL = "https://api.opensea.io/v2/orders/bsc/seaport/listings"
const collectionsURL = "https://api.opensea.io/api/v1/collections"


function Home() {

    const [collections, setCollections] = useState<Collection[]>([]);

    const fetchCollections = async () => {
        const _collections: Collection[] = []

        const res = await axios.get(listingsURL, {
            headers: headers
        })

        const orders = res.data.orders || []

        for (let i = 0; i < orders.length; i++) {
            const assets = orders[i].maker_asset_bundle.assets;

            for (let j = 0; j < assets.length; j++) {
                const collection = assets[j].collection;
                const exists = _collections.some(item => item.slug === collection.slug);

                if (!exists) {
                    _collections.push(collection)
                }
            }
        }

        setCollections(_collections)
    }



    useEffect(() => {
        fetchCollections()
    }, [])


    return (
        <div className="home grid">
            {collections.map((collection, index): any => {
                const url = collection.featured_image_url ?? collection.image_url ?? collection.large_image_url ?? collection.banner_image_url
                return (
                    <div key={index}>
                        <Link to={{
                            pathname: `/collection/${collection.slug}`,
                        }}>
                            {url && <img src={url} />}
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}

export default Home;
