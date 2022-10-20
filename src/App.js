import { useQuery, gql } from '@apollo/client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import React, {useState } from "react";

export default function App() {
  const [ville, setVille] = useState("");
  const [poi, setPoi] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  var temp_Location = gql`	
  {
    poi( size:100,
      filters: [{
        isLocatedAt: {
          schema_address: {
            schema_addressLocality: {
              _eq: "La Rochelle"
            }
          }
        }
      }
      ]) {
      total results {
          rdfs_label{
            value 
          }
          isLocatedAt{
          schema_geo{
            schema_latitude
            schema_longitude
          }
        }
      }
    }
  }
  `;

  const [GET_LOCATIONS,setLocations] = useState(temp_Location);
  
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if(ville !== "" && poi !== ""){
   setLocations(gql`	
     {
      poi(size:100,
        filters: [{
          rdf_type: {
            _eq: "https://www.datatourisme.fr/ontology/core#${poi}"
          }
        }, {
          isLocatedAt: {
            schema_address: {
              schema_addressLocality: {
                _eq: "${ville}"
              }
            }
          }
        }
        ]) {
          total results {
            rdfs_label{
              value 
            }
            isLocatedAt{
            schema_geo{
              schema_latitude
              schema_longitude
            }
          }
        }
      }
    }
  `)
    }
    if(ville !== "" && poi === ""){
     setLocations(gql`	
      {size:100,
       poi(
         filters: [{
           isLocatedAt: {
             schema_address: {
               schema_addressLocality: {
                 _eq: "${ville}"
               }
             }
           }
         }
         ]) {
           total results {
             rdfs_label{
               value 
             }
             isLocatedAt{
             schema_geo{
               schema_latitude
               schema_longitude
             }
           }
         }
       }
     }
   `);
    }
    if(poi !== "" && ville === ""){
      setLocations(gql`	
      {
       poi(size:100,
         filters: [{
           rdf_type: {
             _eq: "https://www.datatourisme.fr/ontology/core#${poi}"
           }
         }
         ]) {
           total results {
             rdfs_label{
               value 
             }
             isLocatedAt{
             schema_geo{
               schema_latitude
               schema_longitude
             }
           }
         }
       }
     }
   `)
    }
    if(lat !== 0 && lng !== 0){
      setLocations(gql`    
      {size:100,
        poi(
          filters: [{
            isLocatedAt: {
              schema_geo: {
                schema_latitude: {
                  _gte: ${parseFloat(lat-0.1)}
                  _lte: ${parseFloat(lat+0.1)}
                }
                schema_longitude: {
                  _gte: ${parseFloat(lng-0.1)}
                  _lte: ${parseFloat(lng+0.1)}
                }
              }
            }
          }
          ]) {
            total results {
              rdfs_label{
                value
              }
              isLocatedAt{
              schema_geo{
                schema_latitude
                schema_longitude
              }
            }
          }
        }
      }
    `)
    }
  }

  function DisplayLocations() {
    const { loading, error, data } = useQuery(GET_LOCATIONS);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : </p>;
    const positionFirstPoi = [data.poi.results[0].isLocatedAt[0].schema_geo[0].schema_latitude[0],data.poi.results[0].isLocatedAt[0].schema_geo[0].schema_longitude[0]];

    return (
    
    <MapContainer center={positionFirstPoi} zoom={13} scrollWheelZoom={true} style={{ height: 800, width: 1200 }}  eventHandlers={{
      click: () => {
        console.log('marker clicked')
      },
    }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.poi.results.map(({ isLocatedAt,rdfs_label }) => (
       <Marker position={[isLocatedAt[0].schema_geo[0].schema_latitude[0],isLocatedAt[0].schema_geo[0].schema_longitude[0]]}>
        <Popup>
         {rdfs_label[0].value}
        </Popup>
      </Marker>
      ))}

    </MapContainer>
    );
  }

  return (
    <div>
      <h2>
        GéoLocalisation POI
        <span role="img">
          🗺️
        </span>
      </h2>
      <form onSubmit={handleSubmit}>
        <label>
          Ville:
          <input
            type="text"
            value={ville}
            onChange={e => setVille(e.target.value)}
          />
        </label>
        <label>
          Poi:
          <input
            type="text"
            value={poi}
            onChange={e => setPoi(e.target.value)}
          />
        </label>
        <label>
          Latitude:
          <input
            type="text"
            value={lat}
            onChange={e => setLat(e.target.value)}
          />
        </label>
        <label>
          Longitude:
          <input
            type="text"
            value={lng}
            onChange={e => setLng(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <br />
      <div>
        <DisplayLocations />
      </div>
    </div>
  );
}
