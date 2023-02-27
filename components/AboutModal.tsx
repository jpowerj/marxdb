import { useState } from 'react';
import { Modal, Button, Group, Text, createStyles } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import styles from '@/styles/AboutModal.module.css';

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

function AboutModal(props: any) {
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
                title={<Text style={{ fontWeight: 'bold'}}>MarxDB: The Marx-Engels Digital Encyclopedia</Text>}
                transition="fade"
                transitionDuration={300}
                transitionTimingFunction="ease"
            >
                <p>Created as part of my <a href="https://academiccommons.columbia.edu/doi/10.7916/k9s3-tq95" className={classes.modalLink} target="_blank" rel="noopener noreferrer">Doctoral dissertation</a> exploring how Natural Language Processing techniques can be used to study intellectual history.
                </p>
                <p>
                    GitHub source <a href="https://github.com/jpowerj/marxdb" className={classes.modalLink} target="_blank" rel="noopener noreferrer">here</a>.
                </p>
                <p>
                    &copy; 2023 <a href="https://cs.stanford.edu/~jjacobs3" className={classes.modalLink} target="_blank" rel="noopener noreferrer">Jeff Jacobs</a>
                </p>
                <Group mt="xl" style={{ alignItems: 'center'}}>
                    <Button variant="outline" onClick={() => props.setOpened(false)} style={{ flex: 1 }}>
                        Close
                    </Button>
                </Group>
            </Modal>
        </>
    );
}

export default AboutModal;