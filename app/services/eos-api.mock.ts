/* tslint:disable:max-line-length */
export const DICTIONARIE_LIST = [
    { id: 'rubricator', title: 'Рубрикатор' },
    { id: 'documents', title: 'Группы документов' },
    { id: 'regions', title: 'Регионы' },
    { id: 'units', title: 'Подраздиления' },
    { id: 'delivery', title: 'Виды доставки' },
    { id: 'reestrs', title: 'Типы реестров' },
    { id: 'visas', title: 'Типы виз' },
];

export const DICTIONARIES = {
    rubricator: {
        id: 'rubricator',
        title: 'Рубрикатор'
    }
};

export const NODES = [
    { id: 1, code: '1', title: 'Общая тематика', parentId: null, isNode: true, isDeleted: false, description: 'description', hasSubnodes: true },
    { id: 2, code: '1.1', title: 'Вопросы промышленности', parentId: 1, isNode: true, isDeleted: false, description: 'description', hasSubnodes: false },
    { id: 3, code: '1.2', title: 'Вопросы сельского хозяйства', parentId: 1, isNode: false, isDeleted: false, description: 'description', hasSubnodes: false },
    { id: 4, code: '1.3', title: 'Вопросы экологии', parentId: 1, isNode: false, isDeleted: false, description: 'description', hasSubnodes: false },
    { id: 5, code: '1.4', title: 'Вопросы строительства', parentId: 1, isNode: false, isDeleted: false, description: 'description', hasSubnodes: false },
    { id: 6, code: '2', title: 'Обращения граждан', parentId: null, isNode: true, isDeleted: false, description: 'description', hasSubnodes: false },
    { id: 7, code: '3', title: 'Финансы', parentId: null, isNode: false, isDeleted: false, description: 'description', hasSubnodes: false },
];
/* tslint:enable:max-line-length */
