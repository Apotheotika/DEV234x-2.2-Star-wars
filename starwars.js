(function() {
	let name1 = document.getElementById('name1');
	let name2 = document.getElementById('name2');
	let cost1 = document.getElementById('cost1');
	let cost2 = document.getElementById('cost2');
	let speed1 = document.getElementById('speed1');
	let speed2 = document.getElementById('speed2');
	let cargo1 = document.getElementById('cargo1');
	let cargo2 = document.getElementById('cargo2');
	let pass1 = document.getElementById('pass1');
	let pass2 = document.getElementById('pass2');

	
	const starships = [{name: 'CR90 Corvette' , id: 2},
		{name: 'V-wing' , id: 75},
		{name: 'Belbullab', id: 22},
		{name: 'Starfighter', id: 74},
		{name: 'Jedi Interceptor', id: 65},
		{name: 'Star Destroyer', id: 3},
		{name: 'Trade Fedaration Cruiser', id: 59},
		{name: 'Solar Sailer', id: 58},
		{name: 'Republic Attack Cruiser', id: 63},
		{name: 'A-wing', id: 28},
		{name: 'B-wing', id: 29},
		{name: 'Naboo Fighter', id: 39},
		{name: 'Millennium Falcon', id: 10}];
	
	const URI_BASE = 'https://swapi.co/api/starships/';
	const selectDivs = document.getElementById('selectDiv');
	const compare = document.getElementById('compare');
	const select = document.createElement('select');

	starships.forEach(starship => {
		let option = document.createElement('option');
		let value = document.createAttribute('value');
		value.value = starship.id;
		option.setAttributeNode(value);
		option.innerText = starship.name;
		select.appendChild(option);
	});

	const select1 = createSelection(select, 'starship1');
	const select2 = createSelection(select, 'starship2');

	selectDivs.appendChild(select2);
	selectDivs.appendChild(select1);

	//bind events
	compare.addEventListener('click', () => {
		run(genFunc).catch(e => {
			alert(e.message);
		});
	});

	//functions
	function betterCSS(el1, el2, category) {
		let css = [];
		const int1 = parseInt(el1[category]);
		const int2 = parseInt(el2[category]);
		if(int1 > int2){
			css = ['higher', ''];
		} else if (int1 < int2) {
			css = ['', 'higher'];
		} else {
			css = ['', ''];
		}
		return css;
	}

	function worseCSS(el1, el2, category) {
		let css = [];
		const int1 = parseInt(el1[category]);
		const int2 = parseInt(el2[category]);
		if(int1 < int2) {
			css = ['higher', ''];
		} else if (int1 > int2) {
			css = ['', 'higher'];
		} else {
			css = ['', ''];
		}
		return css;
	}

	function run(genFunc) {
		const genObject = genFunc();

		function iterate(iteration) 
		{
			if(iteration.done) return Promise.resolve(iteration.value);
				return Promise.resolve(iteration.value)
				.then(val => iterate(genObject.next(val)))
				.catch(val => iterate(genObject.throw(val)));
		}

		try {
			return iterate(genObject.next())
		} catch (err) {
			return Promise.reject(err);
		}
	}
	
	
	function* genFunc() {
		let response1 = yield fetch(`${URI_BASE}${select1.value}`);
		let response2 = yield fetch(`${URI_BASE}${select2.value}`);
		let ship1 = yield response2.json();
		let ship2 = yield response1.json();

		name1.innerText = ship1.name;
		name2.innerText = ship2.name;
		cost1.innerText = ship1.cost_in_credits;
		cost2.innerText = ship2.cost_in_credits;
		speed1.innerText = ship1.max_atmosphering_speed;
		speed2.innerText = ship2.max_atmosphering_speed;
		cargo1.innerText = ship1.cargo_capacity;
		cargo2.innerText = ship2.cargo_capacity;
		pass1.innerText = ship1.passengers;
		pass2.innerText = ship2.passengers;

		let compareCost = worseCSS(ship1, ship2, 'cost_in_credits');
		cost1.className = compareCost[0];
		cost2.className = compareCost[1];

		let compareSpeed = betterCSS(ship1, ship2, 'max_atmosphering_speed');
		speed1.className = compareSpeed[0];
		speed2.className = compareSpeed[1];

		let compareCargo = betterCSS(ship1, ship2, 'cargo_capacity');
		cargo1.className = compareCargo[0];
		cargo2.className = compareCargo[1];

		let comparePass = betterCSS(ship1, ship2, 'passengers');
		pass1.className = comparePass[0];
		pass2.className = comparePass[1];
	}
})();

function createSelection(ElTemplate, val) {
	const newEl = ElTemplate.cloneNode(true);
  const name = document.createAttribute('name');
  name.value = val;
  newEl.setAttributeNode(name);
  return newEl;
}
