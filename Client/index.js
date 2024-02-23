const body = document.querySelector('body');
const trackDietBtn = document.getElementById('btn');
const trackDiet = document.getElementById('track-diet');
const dietInput = document.getElementById('diet-input');


let dietTracker = [];
let isUpdate = false;

let dietToUpdate ={};

const baseURL = 'http://localhost:5152';

const dietList = document.querySelectorAll('.diet-list');

  if (dietList.length = 0) {
    trackDiet.innerHTML = 'Empty'
  }

trackDietBtn.addEventListener('click', () => {
  trackDiet.style.display = 'none';
  dietInput.style.display = 'block';
});

async function saveDiet() {
  if (isUpdate) {
    await updateDiet();
  } else {
    await createDiet();
  }
}

async function createDiet() {
  let diet = {
    meal: '',
    classMajor: '',
    classMinor: '',
    expectedCalories: '',
    dateAndTime: ''
  };

  const mealElement = document.getElementById('meal');
  if (mealElement) {
    const dietIndex = dietTracker.findIndex(m => m.meal == mealElement.value);
    
    if (dietIndex >= 0) {
      return
    }

    diet.meal = mealElement.value;
    mealElement.value = '';    
  }

  const classMajorElement = document.getElementById('class-major');
  if (classMajorElement) {
    diet.classMajor = classMajorElement.value;
  }

  const classMinorElement = document.getElementById('class-minor');
  if (classMinorElement) {
    diet.classMinor = classMinorElement.value;
    classMinorElement.value = '';
  }

  const expectedCaloriesElement = document.getElementById('expected-calories');
  if (expectedCaloriesElement) {
    diet.expectedCalories = expectedCaloriesElement.value;
    expectedCaloriesElement.value = '';
  }

  const dateAndTimeElement = document.getElementById('dateAndTime');
  if (dateAndTimeElement) {
    diet.dateAndTime = dateAndTimeElement.value;
    dateAndTimeElement.value = '';
  }

  // Make an API call to initiate create
  try {
    const createResponse = await fetch(`${baseURL}/dietTracker/create`, {
        method: 'POST',
        body: JSON.stringify(diet),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const createResponseBody = await createResponse.json();
    await listDiets();
    console.log(createResponseBody);
  } catch (error) {
      console.error(error);
  }
};

async function listDiets() {
  const response = await fetch(`${baseURL}/dietTracker/list`);
  dietTracker = await response.json();

  const dietList = document.querySelectorAll('.diet-list');

  if (dietList.length <= 0) {
    return;
  }

  const trackDiet = document.querySelectorAll('.track-diet');
  if (!dietList.length) {
    return;
  }

  trackDiet[0].removeChild(dietList[0]);

  const dietListElement = document.createElement('ul');
  dietListElement.className = 'diet-list';
  // dietListElement.classList.add('diet-list');

  dietTracker.forEach(({id, meal, classMajor, classMinor, expectedCalories, dateAndTime, }) => {
    let newDiet = document.createElement('li');

    // newDiet.addEventListener('dblclick', () => editDiet(dietListElement));

    let dietID = document.createElement('p');
    dietID.innerHTML = id;
    dietID.id = 'diet_id';
    dietID.style.display = 'none';
    newDiet.appendChild(dietID);

    let dietMeal = document.createElement('p');
    dietMeal.innerHTML = meal;
    dietMeal.id = 'meal_id'
    newDiet.appendChild(dietMeal);

    // let dietClassMajor = document.createElement('span');
    // dietClassMajor.innerHTML = classMajor;
    // dietClassMajor.id = 'major';
    // dietMeal.appendChild(dietClassMajor);

    // let dietClassMinor = document.createElement('span');
    // dietClassMinor.innerHTML = classMinor;
    // dietClassMinor.id = 'minor';
    // dietMeal.appendChild(dietClassMinor);

    // newDiet.appendChild(dietMeal);

    let dietClassMajor = document.createElement('p');
    dietClassMajor.innerHTML = classMajor;
    dietClassMajor.id = 'major';
    newDiet.appendChild(dietClassMajor);

    let dietClassMinor = document.createElement('p');
    dietClassMinor.innerHTML = classMinor;
    dietClassMinor.id = 'minor';
    newDiet.appendChild(dietClassMinor);

    let dietExpectedCalories = document.createElement('p');
    dietExpectedCalories.innerHTML = expectedCalories;
    dietExpectedCalories.id = 'calory';
    newDiet.appendChild(dietExpectedCalories);

    let dietDateAndTime = document.createElement('small');
    dietDateAndTime.innerHTML = dateAndTime;
    dietDateAndTime.id = 'dateANDTime';
    newDiet.appendChild(dietDateAndTime);

    let dietEditBtn = document.createElement('small');
    dietEditBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    dietEditBtn.id = 'edit-btn';

    dietEditBtn.addEventListener('click', () => editDiet(newDiet))
    newDiet.appendChild(dietEditBtn);

    let dietDeleteBtn = document.createElement('small');
    dietDeleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    dietDeleteBtn.id = 'delete-btn';

    dietDeleteBtn.addEventListener('click', () => deleteDiet(newDiet))
    newDiet.appendChild(dietDeleteBtn);

    dietListElement.appendChild(newDiet);
  });

  trackDiet[0].appendChild(dietListElement);
}

setTimeout( async() => {
  const saveBtn = document.getElementById('save');
  
  saveBtn.addEventListener('click', () => {
    saveDiet();
    trackDiet.style.display = 'block';
    dietInput.style.display = 'none';
  });
  
  try
    {
      await listDiets();
    }
    catch (error) {
      console.error(error);
    }
}, 3 * 1_000);

const cancelBtn = document.getElementById('cancel');
cancelBtn.addEventListener('click', () => {
  trackDiet.style.display = 'block';
  dietInput.style.display = 'none';
});


const updateDiet = async () =>{
  isUpdate = false;

  const entireDiet = document.querySelectorAll('li');
  
  entireDiet.forEach(diet => {
    let foundDiet = false;
    diet.childNodes.forEach((child, i) => {
      if (child.id === 'diet_id') {
        if (child.innerHTML === dietToUpdate.id) {
          foundDiet = true;
        }
      }

      if (child.id === 'meal_id' && foundDiet) {
        const mealElement = document.getElementById('meal');
        dietToUpdate.meal = mealElement.value;
        mealElement.value = '';
      }
      if (child.id === 'major' && foundDiet) {
        const classMajorElement = document.getElementById('class-major');
        dietToUpdate.classMajor = classMajorElement.value;
        classMajorElement.value = '';
      }
      if (child.id === 'minor' && foundDiet) {
        const classMinorElement = document.getElementById('class-minor');
        dietToUpdate.classMinor = classMinorElement.value;
        classMinorElement.value = '';
      }
      if (child.id === 'calory' && foundDiet) {
        const expectedCaloriesElement = document.getElementById('expected-calories');
        dietToUpdate.expectedCalories = expectedCaloriesElement.value;
        expectedCaloriesElement.value = '';
      }
      if (child.id === 'date&Time' && foundDiet) {
        const dateAndTimeElement = document.getElementById('dateAndTime');
        dietToUpdate.expectedCalories = dateAndTimeElement.value;
        dateAndTimeElement.value = '';
        
        foundDiet = false;     
      }
    })
  })

  // Make API call to initiate update
  try 
    {
        const updateResponse = await fetch(`${baseURL}/dietTracker/update`, {
            method: 'PUT',
            body: JSON.stringify(dietToUpdate),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const responseBody = await updateResponse;
        await listDiets();
        console.log(responseBody);
    }
    catch (error) {
        console.error(error);
    }
}

function editDiet(dietLiElement)  {
  trackDiet.style.display = 'none';
  dietInput.style.display = 'block';

  const mealElement = document.getElementById('meal');
  const classMajorElement = document.getElementById('class-major');
  const classMinorElement = document.getElementById('class-minor');
  const expectedCaloriesElement = document.getElementById('expected-calories');
  const dateAndTimeElement = document.getElementById('dateAndTime');

  dietLiElement.childNodes.forEach(child => {
    if (child.id === 'diet_id') {
      mealElement.value = child.innerHTML;
      dietToUpdate.id = child.innerHTML; 
    }
    if (child.id === 'meal_id') {
      mealElement.value = child.innerHTML;
      dietToUpdate.meal = child.innerHTML; 
    }
    if (child.id === 'major') {
      classMajorElement.value = child.innerHTML;
      dietToUpdate.classMajor = child.innerHTML; 
    }
    if (child.id === 'minor') {
      classMinorElement.value = child.innerHTML;
      dietToUpdate.classMinor = child.innerHTML;  
    }
    if (child.id === 'calory') {
      expectedCaloriesElement.value = child.innerHTML;
      dietToUpdate.expectedCalories = child.innerHTML;  
    }
    // if (child.id === 'date&Time') {
    //   dateAndTimeElement.value = child.innerHTML;
    //   dietToUpdate.dateAndTime = child.innerHTML;  
    // }
  });
  isUpdate = true;
};


const deleteDiet = async (dietLiElement) => {
  let diet_id = '';

  dietLiElement.childNodes.forEach(child => {
    if (child.id === 'diet_id') {
      diet_id = child.innerHTML;
    }
  })

  // Make an API call to initiate delete
  try {
    const deleteResponse = await fetch(`${baseURL}/dietTracker/delete/${diet_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    await listDiets();
    console.log(deleteResponse);
  } 
  catch (error) {
    console.error(error);
  }
}