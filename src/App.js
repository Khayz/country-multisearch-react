import React, { useEffect, useState } from 'react';
import { v1 } from 'uuid';
import './App.css';

function App() {
	const [countries, setCountries] = useState([]);
	const [filteredCountries, setFilteredCountries] = useState([]);
	const [searchCountries, setSearchCountries] = useState({
		country: '',
		capital: '',
		region: '',
		subregion: '',
	});

	const tableTitles = [
		'Country',
		'Capital',
		'Region',
		'Subregion',
		'Latitude',
		'Longitude',
	];

	useEffect(() => {
		(async () => {
			const response = await fetch(
				'https://raw.githubusercontent.com/mledoze/countries/master/countries.json'
			);
			const countries = await response.json();
			setCountries(countries.sort());
		})();
	}, []);

	const handleCountries = (event) => {
		const filterCountries = {
			...searchCountries,
			[event.target.name]: event.target.value,
		};
		setSearchCountries(filterCountries);
		const filter = countries
			.filter(({ name }) =>
				RegExp(filterCountries.country, 'gi').test(name.official)
			)
			.filter(({ capital }) =>
				RegExp(filterCountries.capital, 'gi').test(capital[0])
			)
			.filter(({ region }) => RegExp(filterCountries.region, 'gi').test(region))
			.filter(({ subregion }) =>
				RegExp(filterCountries.subregion, 'gi').test(subregion)
			);
		if (event.target.value.length > 0 && filter.length === 0) {
			return setFilteredCountries([
				{
					name: { official: `${[event.target.name]} not found` },
					capital: ['Not Found'],
					region: 'Not Found',
					subregion: 'null',
					latlng: ['null', 'null'],
				},
			]);
		}
		return setFilteredCountries(filter);
	};

	return (
		<div className='container-md mt-4'>
			<div className='jumbotron'>
				<h1 className='display-4'>Country/Capital Data Multi-Search Service</h1>
				<form className='mt-4'>
					<input
						onChange={handleCountries}
						type='text'
						name='country'
						placeholder='Filter By Country'
					/>
					<input
						onChange={handleCountries}
						type='text'
						name='capital'
						placeholder='Filter By Capital'
					/>
					<input
						onChange={handleCountries}
						type='text'
						name='region'
						placeholder='Filter By Region'
					/>
					<input
						onChange={handleCountries}
						type='text'
						name='subregion'
						placeholder='Filter By Subregion'
					/>
				</form>
			</div>

			<table className='table table-striped table-dark'>
				<thead>
					<tr>
						{tableTitles.map((title) => (
							<th key={title} scope='col'>
								{title}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{countries.length > 0 && filteredCountries.length === 0
						? countries.map((country) => (
								<tr key={v1()}>
									<th scope='row'>{country.name.official}</th>
									<td>{country.capital[0] || country.capital}</td>
									<td>{country.region}</td>
									<td>{country.subregion}</td>
									<td>{country.latlng[0]}</td>
									<td>{country.latlng[1]}</td>
								</tr>
						  ))
						: filteredCountries.map((country) => (
								<tr key={v1()}>
									<th scope='row'>{country.name.official}</th>
									<td>{country.capital[0] || country.capital}</td>
									<td>{country.region}</td>
									<td>{country.subregion}</td>
									<td>{country.latlng[0]}</td>
									<td>{country.latlng[1]}</td>
								</tr>
						  ))}
				</tbody>
			</table>
		</div>
	);
}

export default App;
