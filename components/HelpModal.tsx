import { useState } from 'react';
import { Modal, Button, Group, Text, createStyles, ScrollArea, Tabs } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import styles from '@/styles/AboutModal.module.css';
import { InfoCircle } from 'tabler-icons-react';
import { QuestionMark } from 'tabler-icons-react';
import { modalScrollHeight } from '@/mdbGlobals';
import { HandClick } from 'tabler-icons-react';

const useStyles = createStyles((theme: any) => {
    return {
        modalLink: {
            textDecoration: 'underline',
            '&:hover': {
                textDecoratioin: 'none'
            }
        }
    }
});

function HelpModal(props: any) {
    const theme = useMantineTheme();
    const { classes } = useStyles();
    return (
        <>
            <Modal
                centered
                overlayColor={theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={1.5}
                opened={props.opened}
                onClose={() => props.setOpened(false)}
                title={<Text style={{ fontWeight: 'bold'}}>User Guide</Text>}
                transition="fade"
                transitionDuration={300}
                transitionTimingFunction="ease"
                size="lg"
            >
                <div className="modal-content">
                <Tabs defaultValue="controls">
                    <Tabs.List position="center">
                        <Tabs.Tab value="controls" icon={<HandClick size={14} />}>Controls</Tabs.Tab>
                        <Tabs.Tab value="abbrevs" icon={<QuestionMark size={14} />}>Abbreviations Used</Tabs.Tab>
                        <Tabs.Tab value="stats" icon={<InfoCircle size={14} />}>Statistics</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="controls" pt="xs">
                        <ScrollArea type="auto" style={{ flexGrow: 1, height: '250px' }}>
                        <h2 style={{ margin: 0 }}>UI Controls</h2>
                        <p>
                            <ul>
                                <li>Click and drag the divider in the center, between the entry listings panel on the left and the entry details panel on the right, to allocate more space for a given side.</li>
                            </ul>
                        </p>
                        </ScrollArea>
                    </Tabs.Panel>
                    <Tabs.Panel value="abbrevs" pt="xs">
                <ScrollArea type="auto" style={{ flexGrow: 1, height: modalScrollHeight }}>
                <h2 style={{ margin: 0 }}>Abbreviations Used</h2>
                <p>
                <ul>
                    <li><strong>A</strong>: First quarter of month/year</li>
                    <li><strong>B</strong>: Second quarter of month/year</li>
                    <li><strong>C</strong>: Third quarter of month/year</li>
                    <li><strong>D</strong>: Fourth quarter of month/year</li>
                    <li><strong>Dubious</strong>: Authorship of the text is disputed</li>
                    <li><strong>MEW</strong>: <i>Marx-Engels Werke</i> (German <i>Collected Works</i>, compiled in GDR, 1955-1966)</li>
                    <li><strong>MECW</strong>: <i>Marx-Engels Collected Works</i> (English <i>Collected Works</i>, compiled in UK/USA, 1975-2004)</li>
                    <li><strong>MEGA<sup>1</sup></strong>: <i>Marx-Engels Gesamtausgabe</i>, German <i>Complete Works</i>, first run (not completed), compiled in USSR 1927-1935</li>
                    <li><strong>MEGA<sup>2</sup></strong>: <i>Marx-Engels Gesamtausgabe</i>, German <i>Complete Works</i>, second run, compiled in GDR/FRG 1975-present</li>
                </ul>
                </p>
                </ScrollArea>
                </Tabs.Panel>
                <Tabs.Panel value="stats" pt="xs">
                    <ScrollArea type="auto" style={{ flexGrow: 1, height: '250px' }}>
                                <h2 style={{ margin: 0 }}>Summary Statistics</h2>
                                <p>
                                    <ul>
                                        <li>Total Datapoints: 22,173</li>
                                    </ul>
                                </p>
                            </ScrollArea>
                </Tabs.Panel>
                <Group mt="xl" style={{ alignItems: 'center'}}>
                    <Button variant="outline" onClick={() => props.setOpened(false)} style={{ flex: 1 }}>
                        Close
                    </Button>
                </Group>
                </Tabs>
                </div>
            </Modal>
        </>
    );
}

export default HelpModal;