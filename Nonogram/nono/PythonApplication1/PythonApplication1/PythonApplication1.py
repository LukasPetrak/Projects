# pip install bs4
# pip install selenium


### imports
import os, sys, re, ast, time
from selenium import webdriver 

#from selenium.webdriver.opera.options import Options
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.edge.options import Options





from selenium.webdriver.common.by import By
#from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
#from selenium.webdriver.chrome import service

from random import sample
from typing import List, Tuple, Dict

solution_list: List[List[int]] = []
driver = "test"
cntSol = 0

def valid(s: List[int], r: List[Tuple], c: List[Tuple]):
    s_all: List[int] = s.copy() + [-1]*(len(r)*len(c) - len(s))
    grid: Dict[int, List] = {}
    row: int = 0
    for i in range(0, len(s_all), len(c)):
        grid[row] = s_all[i:(i + len(c))]
        row += 1
    
    # Check row and column constraints
    for row in grid.keys():
        # Ensure row sum is not exceeded
        row_sum_max = sum(r[row])
        row_sum_now = sum([1 if r == 1 else 0 for r in grid[row]])
        if row_sum_now > row_sum_max:
            return False
        
        # If row sum is not exceeded, can they still be obtained from the blank cells?
        sum_from_blank = sum([1 if r == -1 else 0 for r in grid[row]])
        if row_sum_now + sum_from_blank < row_sum_max:
            return False
        
        # Are grouping requirements met?
        if sum_from_blank != 0:
            # Blank cells exist. Assume True.
            continue
        else:
            str_ = "".join([str(a) for a in grid[row]])
            groups = re.split('0+', str_)
            groups = [g for g in groups if g != '']
            group_sums = tuple([len(g) for g in groups])
            if group_sums != r[row]:
                return False
    
    for col in range(len(c)):
        col_values = []
        for row in grid.keys():
            col_values.append(grid[row][col])
        
        # Ensure column sum is not exceeded
        col_sum_max = sum(c[col])
        col_sum_now = sum([1 if c == 1 else 0 for c in col_values])
        if col_sum_now > col_sum_max:
            return False
        
        # If col sum is not exceeded, can they still be obtained from the blank cells?
        sum_from_blank = sum([1 if r == -1 else 0 for r in col_values])
        if col_sum_now + sum_from_blank < col_sum_max:
            return False

        # Are grouping requirements met?
        if sum_from_blank != 0:
            # Blank cells exist. Assume True.
            continue
        else:
            str_ = "".join([str(a) for a in col_values])
            groups = re.split('0+', str_)
            groups = [g for g in groups if g != '']
            group_sums = tuple([len(g) for g in groups])
            if group_sums != c[col]:
                return False
    
    # Both row and column checks passed
    return True

def extend(row_args: List[Tuple], col_args: List[Tuple], partial_solution: List[int]):
    global solution_list
    if len(partial_solution) == len(row_args) * len(col_args):
        solution_list.append(partial_solution.copy())
        getSolution()
        return
    
    # Define move list based on how sparse the row/column sum is
    # move_row, move_col = len(partial_solution) % len(row_args), int(len(partial_solution)/len(row_args)) % len(col_args)
    for move in sample([0, 1], k=2):
        partial_solution.append(move)
        if not valid(partial_solution, row_args, col_args):
            # Backtrack
            partial_solution.pop()
            continue
        extend(row_args, col_args, partial_solution)
        partial_solution.pop()
    return

def getSolution():
    global cntSol
    cntSol += 1 # Globální proměnná se zvětší + 1.
    # Provede se zápis do html el.
    element = driver.find_element(By.ID, "cpt2") # Výběr elementu.
    runscript = "arguments[0].innerText = 'Number of solutions found: " + str(cntSol) + "'" # Script pro zápis do text-pole vybraného prvku.
    driver.execute_script(runscript, element) # Zápis.

def scrapeWeather(choiceEx): # Our function for scraping  
    global driver
    global cntSol

    HtmlPath = get_script_directory()
    wkspFldr = HtmlPath.split('\\')
    HtmlPath = ""
    DrvPath = ""
    for x in wkspFldr:
        if x == "nono":
            DrvPath = HtmlPath + x + "\\"
            HtmlPath += x + "\\nonogram.html" 
            break
        HtmlPath += x + "\\"
    
    #   create driver object 
    if choiceEx == 1:   # Firefox.
        driver = webdriver.Firefox()
    elif choiceEx == 2: # Opera.
        #from selenium.webdriver.chrome import Service
        #System.setProperty("webdriver.opera.driver", DrvPath + 'operadriver.exe');
        #WebDriver driver = new OperaDriver();
        #driver=webdriver.Chrome(DrvPath + 'operadriver.exe')
        options = Options()
        options.binary_location = DrvPath + 'operadriver.exe'#r' location_of_opera.exe'
        driver = webdriver.Opera(options=options, executable_path=DrvPath + 'operadriver.exe')#r' location_of_operadriver.exe')
    elif choiceEx == 3: # Edge.
        #from selenium.webdriver.edge.service import Service
        #ser = Service(os.path.abspath( DrvPath + "msedgedriver.exe"))  # Here you specify the path of Edge WebDriver
        #driver = webdriver.Edge(service = ser)
        #options = Options()
        #driver = webdriver.Edge(options=options, executable_path= DrvPath + "msedgedriver.exe" )
        driver = webdriver.Edge()
    elif choiceEx == 4: # Chrome.
        #driver = webdriver.Chrome(executable_path = os.path.abspath(DrvPath + "chromedriver.exe"))
        driver = webdriver.Chrome()

    driver.get(HtmlPath)  
    driver.maximize_window()

    visibility = "display: none;"
    try: 
        choicont = 0
        while choicont != 1:
            visibility = driver.find_element(By.ID, 'result').get_attribute("style")
            # Čeká na zobrazení prvku.
            while visibility == "display: none;":
                visibility = driver.find_element(By.ID, 'result').get_attribute("style")
                time.sleep(0.5)

            # Z html el získá data pro výpočet.
            row_args = ast.literal_eval(driver.find_element(By.ID, "m_row").text)
            col_args = ast.literal_eval(driver.find_element(By.ID, "m_clm").text)

            # Spustí výpočet.
            extend(row_args, col_args, [])
            
            # Zobrazí výsledek na výstupu a současně vytvoří řetězec pro html stránku. 
            result_sol=""
            for i, solution in enumerate(solution_list):
                for r in range(0, len(row_args)*len(col_args), len(col_args)):
                    result_sol += ''.join(str(x) for x in solution[r:(r + len(col_args))])
                result_sol += ';'
            result_sol = result_sol[ :-1]
            check_val = driver.execute_script("return set_data_to_var(arguments[0])",result_sol) 

            if check_val == result_sol:
                driver.execute_script("get_nono_solution()")    # Na html stránce se spustí kod v js, který zobrazí nono.
                choicont = 0
                while choicont != 1 and choicont != 2:  # Zde se čeká na stisknutí tlačítka konec nebo znovu (1 - konec, 2 -znovu).
                    choicont = driver.execute_script("return get_data_from_var(arguments[0])",'2')    # Kontrola stisknutého tlačítka.
                    time.sleep(0.1)
                solution_list.clear()
                cntSol = 0
            else:
                print('Data not valid')
                print(e)
        #print('Konec')
    except:
        print('Error')
    finally:        
        driver.quit()


# Returns the directory the current script (or interpreter) is running in
def get_script_directory():
    path = os.path.realpath(sys.argv[0])
    if os.path.isdir(path):
        return path
    else:
        return os.path.dirname(path)


def menu():

    menu_choices = {
    1: 'Firefox',
    2: 'Opera',
    3: 'Edge',
    4: 'Chrome',
    5: 'Exit',}

    while(1):
        for key in menu_choices.keys():
            print (' ', key, '-', menu_choices[key])
        choice = ''
        try:
            choice = int(input('\nSelect your browser: '))
            if choice >= 1 and choice <= 4:
               return choice
            elif choice == 5:
                print('\nWe haven\'t even started and you\'re already done.')
                return choice
            else:
                print('Invalid choice. Please enter a number between 1 and 5.')
                print('\n\n\n\n')
        except:
            print('Wrong input. Please enter a number ...')
            print('\n\n\n\n')
       

if __name__ == "__main__":
    volba = menu()
    if(volba < 5):
        scrapeWeather(volba)
    print('Konec')