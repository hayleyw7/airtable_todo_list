import {
    FieldPickerSynced,
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    expandRecord,
    TablePickerSynced,
    TextButton,
} from '@airtable/blocks/ui';
import {globalConfig} from '@airtable/blocks';
import React, {useState} from 'react';

function TodoExtension() {
    const base = useBase();

    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');
    const completedFieldId = globalConfig.get('completedFieldId');

    const table = base.getTableByIdIfExists(tableId);
    const completedField = table ? table.getFieldByIdIfExists(completedFieldId) : null;

    const toggle = (record) => {
        table.updateRecordAsync(
            record, {[completedFieldId]: !record.getCellValue(completedFieldId)}
        );
    };

    const records = useRecords(table);

    const tasks = records && completedField ? records.map(record => (
        <Task
            key={record.id}
            record={record}
            onToggle={toggle}
            completedFieldId={completedFieldId}
       />
   )) : null;

    return (
        <div>
            <TablePickerSynced globalConfigKey="selectedTableId" />
            <FieldPickerSynced table={table} globalConfigKey="completedFieldId" />
            {tasks}
        </div>
    );
}

function Task({record, completedFieldId, onToggle}) {
    const label = record.name || 'Unnamed record';
 
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 18,
                padding: 12,
                borderBottom: '1px solid #ddd',
            }}
        >
            <TextButton
                variant="dark"
                size="xlarge"
                onClick={() => {
                    onToggle(record);
                }}
            >
                {record.getCellValue(completedFieldId) ? <s>{label}</s> : label}
            </TextButton>
            <TextButton
                icon="expand"
                aria-label="Expand record"
                variant="dark"
                onClick={() => {
                    expandRecord(record);
                }}
            />
        </div>
    );
}

initializeBlock(() => <TodoExtension />);
