const ENTER_KEYCODE = 13;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const items = document.querySelector('.items');

  text.init(form, items);
});

const text = (() => {
  let items;

  function init(_form, _items) {
    items = _items;
    _form.addEventListener('submit', formHandler);

    const itemList = items.querySelectorAll('.item');

    /**
     * Nú ítrum við í gegnum allan listann, þ.e. öll items og setjum aturðarhandler á sérhvern hlut í 
     * hverju item, þ.e. checkboxið, textann, þ.e. heiti verkefnis, og eyða takkann.
     */
    for (let i = 0; i<itemList.length; i++) {
      let checkbox = itemList[i].querySelector('.item__checkbox'); 
      let text = itemList[i].querySelector('.item__text');
      let button = itemList[i].querySelector('.item__button');

      checkbox.addEventListener('click', finish); 
      text.addEventListener('click', edit);
      button.addEventListener('click', deleteItem);
    }

  }
/**
 * Atburðarhandler fyrir "Bæta við" takkann, skilgreindur efst í init.
 * Við náum í strenginn inni í textaboxinu við hliðina á takkanum og tökum bil af endanum.
 * Sé strengurinn ekki tómur þá er búið til nýtt item í items listann með strengnum sem verkefnisheiti.
 */
  function formHandler(e) {
    e.preventDefault();

    const { target } = e;
    const { parentNode } = target;
    let newText = target[0].value;

    newText = newText.trim();

    /**
     * Búum til nýtt item undir items. Setjum svo checkbox, textahlut með textanum sem við skrifuðum
     * og eyða takka, allt með fullri virkni. Tökum svo textann úr "bæta við" textaboxinu.
     */
    if (newText !== "") {
      let items = parentNode.querySelector('.items');

      let newItem = el('li', 'item');
      items.appendChild(newItem);

      let newCheckbox = el('input', 'item__checkbox', finish);
      newCheckbox.setAttribute('type', 'checkbox');
      newItem.appendChild(newCheckbox);

      let newTextArea = el('span', 'item__text', edit);
      newTextArea.textContent = newText;
      newItem.appendChild(newTextArea);

      let newButton = el('button', 'item__button', deleteItem);
      newButton.textContent = 'Eyða';
      newItem.appendChild(newButton);

      target[0].value = "";
    }

  }

  /**
   * Atburðahandler til að ljúka færslu, þ.e. haka í checkboxið.
   * Systkini checkboxins, sem er targetið hér, er item__text. Þegar handlerinn virkjast tengist
   * item__text við stillinguna item--done í styles.css og textinn er yfirskrifaður. 
   */
  function finish(e) {
    const { target } = e;
    target.parentNode.classList.toggle('item--done');   
  }

  /**
   * Atburðarhandler til að breyta færslu.
   * Við fjarlægjum textann/spanið sem við ýttum á og setjum inn text input í staðinn.
   * Þetta input hefur eventlistener sem athugar hvort takka er sleppt. 
   */
  function edit(e) {
    const { target } = e;
    const { textContent, parentNode } = target; 

    parentNode.removeChild(target); 

    let input = el('input', 'item__edit'); 
    input.addEventListener('keyup', commit); 
    input.setAttribute('type', 'text');

    //Veljum takkann inni í item, og staðsetjum nýja texta inputtið á réttan stað á undan honum.
    const button = parentNode.querySelector('.item__button');
    parentNode.insertBefore(input, button); 
    input.value = textContent; //Textinn sem var í item__text helst inni í input glugganum.

    input.focus(); //Bendillinn fer sjálfkrafa á.
  }

  /**
   * Atburðahandler til að klára að breyta færslu.
   * Kallað er á hann þegar takka er sleppt í texta input glugganum sem er búinn til í edit.
   * Handlerinn gerir ekki neitt nema að takkanum sem sleppt var sé enter.
   * Þá er input glugganum eytt og textahlutur/span búinn til eins og í upphafi, með textanum úr
   * input glugganum. Sett á réttan stað á undan eyða takkanum.
   */
  function commit(e) {
    const { keyCode } = e; 
    if (keyCode === ENTER_KEYCODE) {
      const { target } = e;
      const { value, parentNode } = target;
      parentNode.removeChild(target);

      let text = el('span', 'item__text', edit);
      const button = parentNode.querySelector('.item__button');
      parentNode.insertBefore(text, button); 
      text.textContent = value;
    }
  }

  /**
   * Atburðahandler til að eyða færslu.
   * Eyðum foreldri eyða takkans, þannig fer öll línan burtu.
   * Losum okkur svo við alla atburðahandlerana fyrir línuna. 
   */
  function deleteItem(e) {
    const { target } = e;
    const parent = target.parentNode;
    parent.parentNode.removeChild(parent); 

    let checkbox = parent.querySelector('.item__checkbox');
    checkbox.removeEventListener('click', finish); 
    let text = parent.querySelector('item__text');
    text.removeEventListener('click', edit);
    let button = parent.querySelector('item__button');
    button.removeEventListener('click', deleteItem);
  }
 
  /**
   * Hjálparfall til að búa til element.
   * type: Tegund af item, eins og span, input og button
   * className: Heitið á klasanum inni í html-inu
   * clickHandler: Handlerinn sem elementið á að nota, það er þá hér ýmist edit, deleteItem eða finish.
   * Fallið virkar bara fyrir handlera sem eru virkjaðir með click. Það hentar ágætlega hér.
   */
  function el(type, className, clickHandler) {

    let div = document.createElement(type);

    div.classList.add(className);
    if (clickHandler) {
      div.addEventListener('click', clickHandler);
    }
    
    return div;
  }

  return {
    init: init
  }
})();
