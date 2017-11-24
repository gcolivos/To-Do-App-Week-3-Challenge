CREATE TABLE tasks(
	id SERIAL PRIMARY KEY,
	task VARCHAR(100) NOT NULL,
	due_date DATE,
	completed VARCHAR(1) NOT NULL CHECK (completed IN ('Y', 'N'))
	);
	
SELECT * from tasks

