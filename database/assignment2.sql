-- 1. insert Tony stark into the account table
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
) VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- 2. change Tony's account_type to `admin`
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3. delete the Tony Stark record
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- 4. modify the GM hummer, replace `small interiors` ith `a huge interior`
UPDATE public.inventory
SET inv_description = REPLACE(
	inv_description,
	'small interiors',
	'a huge interior'
)
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. select make & model from `inventory` and classification from `classification`
-- for vehicles in 'sport category' using INNER JOIN
SELECT
	i.inv_make,
	i.inv_model,
	c.classification_name
FROM
	public.inventory i
INNER JOIN
	public.classification c ON i.classification_id = c.classification_id
WHERE
	c.classification_name = 'Sport';

-- 6. update all invetory records.
UPDATE public.inventory
SET
	inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');